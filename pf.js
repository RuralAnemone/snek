/* LOL
05:16:55 PM <@HaxCPU> anyone can invite, but don't without consent to inviting them by someone who would have permission to do it without that...
05:17:01 PM <@HaxCPU> yep, logic
05:17:27 PM <LibUser> on other places I seen "don't PM people without asking"
05:17:42 PM <@HaxCPU> lol
05:17:50 PM <thelounge38> Why do bots somehow have the right to not want invited?
05:18:02 PM <@HaxCPU> no PMing people from this channel... oh yeah btw you don't need to be in this channel with this rule to PM them
05:18:06 PM <@HaxCPU> XD
05:18:25 PM <@HaxCPU> thelounge38: everyone has the right to not want to be invited :P
05:18:45 PM <thelounge38> Go ahead, start a bot rights movement! I have no reason to object.
*/
/*
This is the most complex example that uses the same technology as the built-in server bots.
*/

const newSnake = require('./wrapper.js') // Change to ./wrapper.js if not in examples folder
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

    let grid = new PF.Grid(100, 100); // Pathfinding grid
    
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

    console.log(snake.me())
  }
  
}

snake.onLogin = function(username){ // When logged in
  console.log(`Connected as ${username}!`)
  snake.spawn() // Spawn the snake
}