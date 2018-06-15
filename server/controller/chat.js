const User = require('../persistence/user');
const Command = require('../model/command');

module.exports = (function userFunctions() {

  function notify(message) {    
    this.server.broadcast(new Command('chat', 'notify', [message]), this)
  }

  function message(message) {    
    this.server.broadcast(new Command('chat', 'message', [this.user.username, message]), this)
  }

  return { notify, message }
})()