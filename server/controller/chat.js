const User = require('../persistence/user');
const Command = require('../model/command');

module.exports = (function userFunctions() {

  function addMessage(message) {    
    this.server.broadcast(new Command('chat', 'addMessage', ['text', this.user.username, message]), this)
  }
  
  return { addMessage }
})()