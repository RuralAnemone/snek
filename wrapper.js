// This is what connects your code to the server, and the code that provides extra utilities. Edit with caution.

const { io } = require("socket.io-client");

function distanceBetweenPoints(p1, p2) {
    return Math.abs(Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1])));
}

module.exports = function(auth, host = "https://Code-your-snake.codingmaster398.repl.co"){
  const socket = io(host, {
    extraHeaders: {
      "cookie": `REPL_AUTH=${auth}`
    }
  });

  this.username = ``
  this.onLogin = ()=>{}
  this.onSpawnFail = this.spawn
  this.onSpawn = ()=>{}
  this.onAnnouncement = ()=>{}
  this.onDeath = ()=>{}
  this.onKill = ()=>{}
  this.onTick = ()=>{}
  this.spawned = false
  this.x = 0
  this.y = 0

  this.spawn = ()=>{
    socket.emit('spawn')
  }

  this.disconnect = ()=>{
    socket.disconnect()
  }

  this.setDirection = (d)=>{
    if(typeof d == 'string'){
      d = d.toLowerCase()
      
      if(d.startsWith('l')){
        d = 0
      }else if(d.startsWith('r')){
        d = 1
      }else if(d.startsWith('u')){
        d = 2
      }else if(d.startsWith('d')){
        d = 3
      }
    }
    socket.emit('direction',d)
  }

  this.me = ()=>{
    if(this.spawned && this.objects.players[this.username]){
      return this.objects.players[this.username]
    }else return;
  }

  this.closestApple = ()=>{
    if(this.objects.players[this.username]){

      let apples = this.apples()
      let closest = [0,0]
      let closestnum = 999
      for(let e=0; e<apples.length; e++){
        if(distanceBetweenPoints(this.objects.players[this.username].head, apples[e]) < closestnum){
          closestnum = distanceBetweenPoints(objects.players[username].head, apples[e])
          closest = apples[e]
        }
      }

      return {
        x: closest[0],
        y: closest[1]
      }
    }else return {
      x: 0,
      y: 1
    }
  }
  this.apples = ()=>{
    if(this.objects.players[this.username]){

      let apples = []
      
      for(let i=0;i<this.objects.other.length;i++){
        if(this.objects.other[i] && this.objects.other[i].type <= 4){
          apples.push(this.objects.other[i].pos)
        }
      }

      return apples
    }else return []
  }
  this.blackHoles = ()=>{
    if(this.objects.players[this.username]){

      let bhs = []
      
      for(let i=0;i<this.objects.other.length;i++){
        if(this.objects.other[i] && this.objects.other[i].type == 5){
          bhs.push(this.objects.other[i].pos)
        }
      }

      return bhs
    }else return []
  }
  this.bodyPositions = ()=>{
    if(this.objects.players[this.username]){

      let bp = []
      
      for (const player in this.objects.players) {
        for(let i=0;i<this.objects.players[player].body.length;i++){
          bp.push(this.objects.players[player].body[i])
        }
      }

      return bp
    }else{return []}
  }
  this.headPositions = ()=>{
    if(this.objects.players[this.username]){

      let bp = []
      
      for (const player in this.objects.players) {
        bp.push(this.objects.players[player].head)
      }

      return bp
    }else{return []}
  }
  this.partPositions = ()=>{
    if(this.objects.players[this.username]){
      return [...this.headPositions(), ...this.bodyPositions()]
    }else{return[]}
  }

  this.objects = {
    players:{},
    other:[]
  }

  socket.on('loggedIn',(a,b)=>{
    if(a){
      this.onLogin(b)
      this.username = b
    }else{
      throw "Authentication is wrong - please check what you pass to the starting function"
    }
  })

  socket.on('spawned',(d)=>{
    if(d[0]){
      this.onSpawn(d[1],d[2])
      this.spawned = true
    }else{
      this.onSpawnFail()
      this.spawned = false
    }
  })

  socket.on('message',(a)=>{
    this.onAnnouncement(a)
  })

  socket.on('death',(reason)=>{
    this.spawned = false
    this.onDeath(reason)
  })

  socket.on('kill',(a)=>{
    this.onKill(a[0],a[1])
  })

  socket.on('objects',(o)=>{
    this.objects = o
    if(this.objects.players[this.username]){
      
      this.x = this.objects.players[this.username].head[0]
      this.y = this.objects.players[this.username].head[1]
      
    }
    this.onTick(o)
  })

  socket.on('disconnect',()=>{
    this.spawned = false
    socket.connect()
  })
  
  return this
}