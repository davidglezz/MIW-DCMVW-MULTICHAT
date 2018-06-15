const Command = require('../model/command');

module.exports = (function userFunctions() {

  async function login(success) {
    
  }

  async function offer(offer, source) {
    
  }

  async function answer(answer) {
    
  }

  async function candidate(candidate) {
    
  }

  async function leave() {
    
  }

  function message(username, message) {
    console.log(`p2pchat message from ${this.user.username} to ${username}: ${message}`)
    this.server.sendToUser(username, new Command('p2pchat', 'message', [this.user.username, message]))
  }
  

  return { message, login, offer, answer, candidate, leave}
})()
