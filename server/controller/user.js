const User = require('../persistence/user');
const Command = require('../model/command');
const WebSocket = require('ws')

module.exports = (function userFunctions() {

  function getUserList(wss) {
    return [...wss.clients]
      .filter(c => c && c.user)
      .map(c => ({id: c.id, name:c.user.username}))
  }

  async function login(username, password) {
    if (!username || !password) {
      return new Command('alert', 'showMessage', ['Prueba a escribir un usuario y contraseña.'])
    }

    try {
      var user = await User.findOne({ username, password });
    } catch (ex) {
      return new Command('alert', 'showMessage', ['Ocurrió un error. Intentalo de nuevo.'])
    }

    if (!user) {
      return new Command('alert', 'showMessage', ['Usuario o contraseña incorrectos.'])
    }

    // Disconnect logged in sessions
    [...this.server.clients].forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.user && client.user.username === user.username) {
        client.server.broadcast(new Command('user', 'userDisconnect', [client.id, client.user.username]))
        client.user = undefined
        client.id = client.server.getUniqueID()
        client.send(JSON.stringify(new Command('user', 'requestAuth', [])))
      }
    })

    this.id = user._id
    this.user = user
    this.server.broadcast(new Command('user', 'userConnect', [this.id, username]))
    return new Command('user', 'loggedin', [this.id, username, getUserList(this.server)])  
  }

  async function register(username, password) {
    if (!username || !password) {
      return new Command('alert', 'showMessage', ['Prueba a escribir un usuario y contraseña.'])
    }
    
    var user = User({ username, password })
    try {
      const res = await user.save()
      console.log(res);
    } catch (ex) {
      // console.error(ex.message)
      return new Command('alert', 'showMessage', ['Ocurrió un error, puede que el usuario ya exista.'])
    }
    // Login
    this.id = user._id
    this.user = user
    this.server.broadcast(new Command('user', 'newUser', [this.id, username]))
    return new Command('user', 'loggedin', [this.id, username, getUserList(this.server)]) 
  }

  async function logout(id) {
    this.server.broadcast(new Command('user', 'userDisconnect', [this.id, this.user.username]))
    this.user = undefined
    this.id = this.server.getUniqueID()
    return new Command('user', 'requestAuth', [])
  }

  async function userlist() {
    return new Command('user', 'updateUserList', [getUserList(this.server)])
  }
  
  return { login, register, logout }
})()