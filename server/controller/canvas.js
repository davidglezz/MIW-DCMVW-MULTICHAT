const User = require('../persistence/user');
const Command = require('../model/command');
const fabric = require('fabric').fabric;

module.exports = (function userFunctions() {
  const canvas = new fabric.StaticCanvas()
  canvas.renderOnAddRemove = false

  function getCanvas() {
    console.log("getCanvas.")
    return new Command('canvas', 'setCanvas', [canvas.toObject(['id'])])
  }

  function addObjects(objects) {
    console.log("addObjects", objects.map( o => o.id))
    fabric.util.enlivenObjects(objects, objs => {
      canvas.add.apply(canvas, objs)
    })
    this.server.broadcast(new Command('canvas', 'addObjects', [objects]), this)
  }

  function removeObjects(ids) {
    console.log("removeObjects", ids)
    canvas.remove.apply(canvas, canvas.getObjects().filter(obj => ids.includes(obj.id)))
    this.server.broadcast(new Command('canvas', 'removeObjects', [ids]), this)
  }

  function modifyObjects(objects) {
    console.log("modifyObjects", objects.map( o => o.id))
    objects.forEach(obj => {
      const theObj = canvas.getObjects().find(o => o.id === obj.id)
      if (theObj) {
        theObj.set(obj)
      } // TODO else add
    })
    this.server.broadcast(new Command('canvas', 'modifyObjects', [objects]), this)
  }

  return { getCanvas, addObjects, removeObjects, modifyObjects }
})()
