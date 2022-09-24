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

    // Clear the console and log some data
    console.clear()
    console.log(`I am at X ${snake.x}, Y ${snake.y}`)
    console.log(`The closest apple is at X ${closestApple.x}, Y ${closestApple.y}`)
    console.log(`There are ${snake.apples().length} apples on the grid`)
    console.log(`There are ${snake.blackHoles().length} black holes on the grid`)
    console.log(`There are ${snake.partPositions().length} snake parts on the grid`)
  }
  
}

snake.onLogin = function(username){ // When logged in
  console.log(`Connected as ${username}!`)
  snake.spawn() // Spawn the snake
}