const User = require('../persistence/user');

module.exports = (function userFunctions() {

  async function login(username, password) {
    try {
      var user = await User.findOne({ username, password });
    } catch (ex) {
      return {
        topic: 'alert',
        fn: 'showMessage',
        args: ['Ocurrió un error. Intentalo de nuevo.']
      }
    }

    if (!user) {
      return {
        topic: 'alert',
        fn: 'showMessage',
        args: ['Usuario o contraseña incorrectos.']
      }
    }

    this.id = user._id
    this.user = user

    this.server.broadcast({
      topic: 'user',
      fn: 'userConnect',
      args: [this.id, username]
    })
    return {
      topic: 'user',
      fn: 'loggedin',
      args: [this.id, username]
    }
  }

  async function register(username, password) {
    var newUser = User({ username, password })
    try {
      await newUser.save()
    } catch (ex) {
      console.error(ex.message)
      return {
        topic: 'alert',
        fn: 'showMessage',
        args: ['Ocurrió un error, puede que el usuario ya exista.']
      }
    }
    this.server.broadcast({
      topic: 'user',
      fn: 'newUser',
      args: [this.id, username]
    })
    return {
      topic: 'user',
      fn: 'loggedin',
      args: [this.id, username]
    }
  }
  
  return { login, register }
})()