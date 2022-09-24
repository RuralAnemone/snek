/*
This is the most complex example that uses the same technology as the built-in server bots.
*/

const newSnake = require('../../wrapper.js') // Change to ./wrapper.js if not in examples folder
let PF = require('pathfinding'); // Pathfinder module

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

    let dontHit = [...snake.blackHoles(), ...snake.bodyPositions()] // Avoid black holes and bodies

    let grid = new PF.Grid(150, 150); // Pathfinding grid
    
    for(let i=0;i<dontHit.length;i++){ // Set all of the positions in dontHit as unwalkable
      grid.setWalkableAt(dontHit[i][0], dontHit[i][1], false);
    }

    let finder = new PF.DijkstraFinder(); // Use the Dijkstra pathfinding algorithm
    let p = finder.findPath(snake.x, snake.y, closestApple.x, closestApple.y, grid) // Find the best path to the apple

    p = p[1] // Get the next position to move to according to the path
    
    if(p[0] == snake.x){ // Move!
      if(p[1] > snake.y){
        snake.setDirection('down')
      }else{
        snake.setDirection('up')
      }
    }else{
      if(p[0] > snake.x){
        snake.setDirection('right')
      }else{
        snake.setDirection('left')
      }
    }

    console.log(`I am at X ${snake.x} Y ${snake.y} with the length ${snake.me().body.length}`)
  }
  
}

snake.onLogin = function(username){ // When logged in
  console.log(`Connected as ${username}!`)
  snake.spawn() // Spawn the snake
}