// keep online: (with up.repl.link)
const express = require('express');
const path = require('path');
const app = express();
const port = process.env['PORT'] || 42069;
app.get('/', function(req, res){res.sendFile(path.join(__dirname, 'index.html'))});
app.listen(port);

let movesThisRound = []
let data = {}

//attempt to read from /data/learning.json
const fs = require('fs');

fs.readFile('./data/learning.json', 'utf8', (err, contents) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`successfully read ./data/learning.json with data:\n${contents}`);
  if (contents) {
    let learning = JSON.parse(contents).data
  }
});

var score = 0;

const newSnake = require('./wrapper.js')

let snake = newSnake(process.env.auth) // Login with the auth cookie in the secrets tab

snake.onSpawn = function(x,y){ // When the snake spawns
  console.log(`Spawned at X ${x}, Y ${y}`)
}

snake.onDeath = function(reason){ // When the snake dies
  console.clear()
  fs.writeFile('./data/learning.json', JSON.stringify(data), err => {
    if (err) {
      console.error(err);
    }
    console.log(`file written successfully with contents as follows:\n${data}`)
  });
  score = 0; // obviously don't die
  movesThisRound = []
  console.log(`Died! Reason: ${reason}. Respawning...`)
  snake.spawn()
}

snake.onKill = function(name, growth) {
  console.log(`Killed ${name} and grew ${growth} units.`);
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

snake.onTick = function(){ // When the game updates
  if(snake.spawned){ // If the snake is alive
    let closestApple = snake.closestApple() // nice
    let my = snake.me()
    if (my.grow > 0) {
      score++;
      console.log(`ate, fruit; length is now ${my.body.length}`)
    } else {
      score -= 0.1; // penalize the snake for doing nothing
    }
    console.clear()
    console.log(`I am at X ${snake.x}, Y ${snake.y}`)
    console.log(`The closest apple is at X ${closestApple.x}, Y ${closestApple.y}`)
    fs.readFile('./data/learning.json', 'utf8', (err, contents) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`successfully read ./data/learning.json with data:\n${contents}`);
      if (contents) {
        let data = JSON.parse(contents).data
      }
    
        snake.setDirection(decide())
        console.log(snake.me())
        console.log(`score: ${score}`)
      });
  }
  
}

snake.onLogin = function(username){ // When logged in
  console.log(`Connected as ${username}!`)
  snake.spawn() // Spawn the snake
}

function decide(me, closestApple, others){
  let direction = Math.floor(4*Math.random())
  movesThisRound.push(direction)
  return direction
}