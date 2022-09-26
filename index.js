// keep online: (with up.repl.link)
const express = require('express');
const path = require('path');
const app = express();
const port = process.env['PORT'] || 42069;
const irc = require("irc-framework");
let PF = require('pathfinding');
const expressWs = require("express-ws")(app);
const { EventEmitter } = require("events");
const logEmitter = new EventEmitter();

// Use express.static() , works better
// thank you :)
app.use("/", express.static(path.join(__dirname, "site/")));
//app.listen(port);

// code that I definitely wrote

// Connect to IRC
/**
 * WebSocket handler for the /ws.sock path
 * @param {ExpressWs} ws
 */
const wsHandler = function(ws, req) {
  logEmitter.on("message", function(data) {
    ws.send(data);
  });
};
app.ws("/ws.sock", wsHandler);

app.listen(8080, "0.0.0.0");
/*const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['1.1.1.3']);
var ircAddress=await (resolver.resolve4("shell.oddprotocol.org"));
console.log(ircAddress[0]);*/
const client = new irc.Client({
  nick: "Rural's bot",
  host: "shell.oddprotocol.org",
  port: 7426,
  account: {
    account: "rural's bot",
    password: process.env.ircPass
  },
  auto_reconnect: true,
  auto_reconnect_max_wait: 300000,
  auto_reconnect_max_retries: 3000,
});
client.connect();
process.on('SIGINT', () => {
  console.log('Exiting');
  process.kill(process.pid, 9);
  client.say("#rural's-snake-bot", "Shutting down");
  setTimeout(function() {
    process.exit(0);
  }, 1000);
});
process.on('SIGHUP', () => {
  console.log('Exiting');
  process.kill(process.pid, 9);
  client.say("#rural's-snake-bot", "Shutting down");
  setTimeout(function() {
    process.exit(0);
  }, 1000);
});
process.on('SIGTERM', () => {
  console.log('Exiting');
  process.kill(process.pid, 9);
  client.say("#rural's-snake-bot", "Shutting down");
  setTimeout(function() {
    process.exit(0);
  }, 1000);
});
var logChan = { action: function(data) { client.action("#rural's-snake-bot", data) }, say: function(data) { client.say("#rural's-snake-bot", data) } };
client.on("registered", function() {
  client.say("NickServ", `IDENTIFY rural's bot ${process.env.ircPass}`);
  client.join("#rural's-snake-bot");
  var logChan = client.channel("#rural's-snake-bot");
  //let snake = newSnake(process.env.auth) // Login with the auth cookie in the secrets tab
});
/*client.on("raw", function(raw) {
  if(raw.from_server) {
    console.log(`[RAW] ${raw.line}`);
  }
});*/
client.on("debug", function(debug) {
  console.log(`[DEBUG] ${debug}`);
});

client.on("invited", function(invite) {
  client.join(invite.channel);
  bot.say(invite.channel, `Thanks for the invite, ${invite.nick}, but why should I be here?`);
  bot.part(invite.channel, `Thanks but no thanks, ${invite.nick} - Rural's bot`);
});
client.on("kick", function(kickEvent) {
  if (kickEvent.kicked == client.user.nick && kickEvent.channel == "#rural's-snake-bot") {
    client.join(kickEvent.channel);
    logChan.say("Do not kick me.");
    logChan.action(`is mad at ${kickEvent.nick}`);
    client.say("ChanServ@services.solanum.repl", `AKICK #rural's-snake-bot ADD *!*@${kickEvent.hostname} !T 1d Don't kick Rural's bot | Automatic AKICK added by Rural's bot'`);
    client.say("ChanServ@services.solanum.repl", "UNBAN #rural's-snake-bot");
    setTimeout(function() {
      bot.join("#rural");
    }, 1000);
  }
});

// end of code that I definitely wrote and didn't just take verbatim from https://replit.com/@9pfs/snake-bot?v=1#index.js

let movesThisRound = []
let data = {}

//attempt to read from /data/learning.json
//const fs = require('fs');

/*fs.readFile('./data/learning.json', 'utf8', (err, contents) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`successfully read ./data/learning.json with data:\n${contents}`);
  if (contents) {
    let learning = JSON.parse(contents).data
  }
});*/

var score = 0;
var scoreCache = score;

const newSnake = require('./wrapper.js')

let snake = newSnake(process.env.auth) // Login with the auth cookie in the secrets tab

snake.onSpawn = function(x, y) { // When the snake spawns
  console.log(`Spawned at X ${x}, Y ${y}`)
  logChan.action(`Spawned at [${x},${y}]`)
}

snake.onDeath = function(reason) { // When the snake dies
  /*fs.writeFile('./data/learning.json', JSON.stringify(data), err => {
    if (err) {
      console.error(err);
    }
    console.log(`file written successfully with contents as follows:\n${data}`)
  });*/
  score = 0; // obviously don't die
  movesThisRound = []
  console.log(`Died! Reason: ${reason}. Respawning...`)
  logChan.action(`Died! Reason: ${reason}. Respawning...`)
  snake.spawn()
}

snake.onKill = function(name, growth) {
  console.log(`Killed ${name} and grew ${growth} units.`);
  logChan.action(`Killed ${name} and grew ${growth} units.`);
  score += growth / 2;
}

/* depreacted but I still want to keep the work lol
function rewriteDirection(x, direction){ // so 0,1,2,3 is r,u,l,d (circular and makes math easier for deciding direction, e.g. if direction == 2 then set direction to direction + 1 (turn left) or direction + -1 (turn right) or direction + 0 (go straight)) (and vice versa)

  //direction is for api to mine vs mine to api (1 and 0 respectively)
  if(!direction) {
    return ((x**3)/3)-((11*(x**2))/2)+(31*x)/6+1
  } else {
    return ((-(x**3))/3)+((5*(x**2))/2)-((25*x)/6)+2 // just graph these lol
  }
}
*/

snake.onTick = function() { // When the game updates
  if (snake.spawned) { // If the snake is alive
    let closestApple = snake.closestApple() // nice
    let my = snake.me()
    if (my.grow) {
      if (my.grow > 0) {
        score++;
        console.log(`ate, fruit; length is now ${my.body.length}`)
        logChan.action(`ate, fruit; length is now ${my.body.length}`)
      } else {
        score -= 0.1; // penalize the snake for doing nothing
      }
    }
    /*fs.readFile('./data/learning.json', 'utf8', (err, contents) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`successfully read ./data/learning.json with data:\n${contents}`);
      if (contents) {
        let data = JSON.parse(contents).data
      }
      });*/
    snake.setDirection(decide())
    console.log(snake.me())
    console.log(`score: ${score}`)
  }

}

snake.onLogin = function(username) { // When logged in
  console.log(`Connected as ${username}!`)
  logChan.action(`${username} logged in and started to play`)
  snake.spawn() // Spawn the snake
}

function decide() {
  let direction = Math.floor(4 * Math.random())
  movesThisRound.push(direction)
  return direction
}

function pathToNearestGoldenApple() {
  
}