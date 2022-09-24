# Documentation  for wrapper.js

## Init
```js
const newSnake = require('./wrapper.js')
```

## Creating + logging in
```js
let snake = newSnake("REPL_AUTH cookie", "host (optional, defaults to main server)")
```

## Functions called by the snake
These functions you can change by typing something like this:
```js
snake.onLogin = function(){
}
```
That function will fire whenever the snake logs in. Functions are as follows:
### onLogin
Parameters are `username`. Fires when the snake successfully logs in.

Example:
```js
snake.onLogin = function(username){ // When logged in
  console.log(`Connected as ${username}!`)
  snake.spawn() // Spawn the snake
}
```

### onSpawnFail
No parameters.
Fires when there is not enough room on the grid to spawn (very unlikely).
Defaults to the spawn function, constantly retrying.

### onAnnouncement
Parameters are `text`. Fires when an announcement occurs (top left text on the website)

### onDeath
Parameters are `reason`. Fires when the snake dies.

Example:
```js
snake.onDeath = function(reason){ // When the snake dies
  console.log(`Died! Reason: ${reason}. Respawning...`)
  snake.spawn() // Respawn
}
```
### onKill
Parameters are `name` and `growth`. Fires when the snake kills another. `name` is the person killed, and `growth` is how much the snake will grow due to the kill.

Example:
```js
snake.onKill = function(name, growth){ // When the snake dies
  console.log(`Killed ${name} and grew ${growth} spaces.`)
}
```

### onTick
Parameters are `objects`. Fires when the grid updates.
```js
snake.onTick = function(){
  if(snake.spawned){
    snake.setDirection('up') // Moves up every tick if the snake is alive
  }
}
```

## The "objects"
You can obtain a list of all objects (players and other) in the `onTick` function or `snake.objects`.

The structure of the object goes as follows:
```json
{
  players:{
    "playerName":{
      body: [[0,1],[0,2]],
      head: [0,0],
      direction: 0,
      grow: 0,
      bc: {r:0,g:0,b:0}
    }
  },
  other:[
    {
      pos: [100,150],
      type: 3
    },
    {
      pos: [100,152],
      type: 4
    },
    {
      pos: [100,154],
      type: 5
    }
  ]
}
```

Each player object has the following:
- `body` is an array of arrays, where each array contains an X and Y coordinate
- `head` is an array with the X and Y coordinate of the head
- `direction` is the direction of the snake (0 is left, 1 is right, 2 is up and 3 is down)
- `grow` is how much the snake is currently growing
- `bc` is the snake's color in RGB

Each  "other" object has the following:
- `pos` is an array with the X and Y coordinate of the object
- `type` is the type of the object (3 for food, 4 for golden food, 5 for black hole)

## Functions
How you interact with your snake!

### snake.spawn()
Attempts to spawn the snake
### snake.disconnect()
Disconnects and (maybe) tries to reconnect the snake
### snake.setDirection(direction)
Sets the direction of the snake.
Pass direction as either a number or a string.

`0`, `left`, and `l` will all change the snake to going left.

### snake.me()
Get the player object of the snake
### snake.closestApple()
If the snake is alive, returns the closest apple to the head of the snake.

An example return would be `{x: 50, y: 40}`
### snake.apples()
Returns array of arrays (apples), where each array contains an X and Y coordinate of an apple.
### snake.blackHoles()
Returns array of arrays (black holes), where each array contains an X and Y coordinate of a black hole.
### snake.bodyPositions()
Returns array of arrays (snake bodies), where each array contains an X and Y coordinate of a par of a snake's body.
### snake.headPositions()
Returns array of arrays (heads), where each array contains an X and Y coordinate of a snake's head.
### snake.partPositions()
`headPositions` and `bodyPositions` all in one array.

## Variables
Accessed like `snake.x` or `snake.objects`

### snake.username
The username of the snake
### snake.spawned
If the snake is alive and moving
### snake.x
X position of the snake
### snake.y
Y position of the snake