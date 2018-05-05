const User = require('../persistence/user');
const Command = require('../model/command');
const fabric = require('fabric').fabric;

// const canvas = new fabric.StaticCanvas();
// const canvas = new fabric.StaticCanvas(null, {width: 1000, height: 1000});
// const canvas = new fabric.Canvas({}, {width: 1000, height: 1000});
// https://github.com/kangax/fabric.js/issues/4586

module.exports = (function userFunctions() {

  function addObjects(objs) {
    this.server.broadcast(new Command('canvas', 'addObjects', [objs]), this)
  }

  function removeObjects(ids) {
    this.server.broadcast(new Command('canvas', 'removeObjects', [ids]), this)
  }

  function modifyObjects(objs) {
    this.server.broadcast(new Command('canvas', 'modifyObjects', [objs]), this)
  }

  return { addObjects, removeObjects, modifyObjects }
})()
