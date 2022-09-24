/*
Welcome to your Code your snake bot!
This is a minimal example showing spawning, the snake's position, and where the closest apple is.

It won't work right away because you need to authenticate yourself. Read /learn/welcome.md.
*/

const newSnake = require('../../wrapper.js') // Change to ./wrapper.js if not in examples folder

let snake = newSnake(process.env.auth) // Login with the auth cookie in the secrets tab

snake.onSpawn = function(x,y){ // When the snake spawns
  console.log(`Spawned at X ${x}, Y ${y}`)
}

snake.onDeath = function(reason){ // When the snake dies
  console.log(`Died! Reason: ${reason}. Respawning...`)
  snake.spawn() // Respawn
}

snake.onTick = function(){ // When the game updates
  
  if(snake.spawned){ // If the snake is alive

    let closestApple = snake.closestApple() // Get the closest apple

    // Clear the console and log the snake's position and the closest apple's position
    console.clear()
    console.log(`I am at X ${snake.x}, Y ${snake.y}`)
    console.log(`The closest apple is at X ${closestApple.x}, Y ${closestApple.y}`)

    // Set direction to up. How can we decide what other direction to go?
    snake.setDirection('up')
  }
  
}

snake.onLogin = function(username){ // When logged in
  console.log(`Connected as ${username}!`)
  snake.spawn() // Spawn the snake
}