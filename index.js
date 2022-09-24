// keep online: (with up.repl.link)
const express = require('express');
const path = require('path');
const app = express();
const port = process.env['PORT'] || 42069;
app.get('/', function(req, res){res.sendFile(path.join(__dirname, 'index.html'))});
app.listen(port);

var score = 0;
var lengthCache = 0;

const newSnake = require('./wrapper.js')

let snake = newSnake(process.env.auth) // Login with the auth cookie in the secrets tab

snake.onSpawn = function(x,y){ // When the snake spawns
  console.log(`Spawned at X ${x}, Y ${y}`)
}

snake.onDeath = function(reason){ // When the snake dies
  console.clear()
  lengthCache = 0
  score--; // obviously don't die
  console.log(`Died! Reason: ${reason}. Respawning...`)
  snake.spawn()
}

snake.onKill = function(name, growth) {
  console.log(`Killed ${name} and grew ${growth} units.`);
  score += growth / 2;
}

function rewriteDirection(x){
  return ((-(x**3))/3)+((5*(x**2))/2)-((25*x)/6)+2
}

snake.onTick = function(){ // When the game updates
  if(snake.spawned){ // If the snake is alive
    let closestApple = snake.closestApple()
    let my = snake.me()
    if (grow > 0) {
      score++;
      console.log(`ate, fruit; length is now ${my.body.length}`)
    } else {
      score -= 0.1; // penalize the snake for doing nothing
    }
    console.clear()
    console.log(`I am at X ${snake.x}, Y ${snake.y}`)
    console.log(`The closest apple is at X ${closestApple.x}, Y ${closestApple.y}`)
      snake.setDirection(decide(snake.me(), closestApple, snake.objects))
    console.log(snake.me())
    console.log(`score: ${score}`)
  }
  
}

snake.onLogin = function(username){ // When logged in
  console.log(`Connected as ${username}!`)
  snake.spawn() // Spawn the snake
}

function decide(me, closestApple, others){
  return Math.floor(4*Math.random())
} // nice