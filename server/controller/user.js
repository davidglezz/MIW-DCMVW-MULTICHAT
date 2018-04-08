const User = require('../persistence/user');
const Command = require('../model/command');

module.exports = (function userFunctions() {

  function getUserList(wss) {
    return [...wss.clients]
      .filter(c => c && c.user)
      .map(c => ({id: c.id, name:c.user.username}))
  }

  async function login(username, password) {
    try {
      var user = await User.findOne({ username, password });
    } catch (ex) {
      return new Command('alert', 'showMessage', ['Ocurrió un error. Intentalo de nuevo.'])
    }

    if (!user) {
      return new Command('alert', 'showMessage', ['Usuario o contraseña incorrectos.'])
    }

    this.id = user._id
    this.user = user
    this.server.broadcast(new Command('user', 'userConnect', [this.id, username]))
    return new Command('user', 'loggedin', [this.id, username, getUserList(this.server)])  
  }

  async function register(username, password) {
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
    return new Command('user', 'requestAuth', [])
  }

  async function userlist() {
    return new Command('user', 'updateUserList', [getUserList(this.server)])
  }
  
  return { login, register }
})()