const User = require('../persistence/user');

module.exports = (function userFunctions() {

  function addMessage(message) {    
    this.server.broadcast({
      topic: 'chat',
      fn: 'addMessage',
      args: ['text', this.user.username, message]
    })
  }
  
  return { addMessage }
})()