const newSnake = require('../../wrapper.js') // Change to ./wrapper.js if not in examples folder

let snake = newSnake(process.env.auth) // Login with the auth cookie in the secrets tab

snake.onLogin = function(username){ // When logged in
  console.log(`Connected as ${username}!`)
}