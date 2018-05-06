import { Component, OnInit } from '@angular/core';
import { Base64 } from '../Base64';
import { UserService } from '../user.service';
import { WebSocketService } from '../websocket.service';
import { Subscription } from 'rxjs/Subscription';
import { Command } from '../models/Command';
//import fabric = require('fabric/fabric-impl');
declare const fabric: any;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  private loaded = false
  private socketSubscription: Subscription
  private canvas
  private wrapper: HTMLElement

  private colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', 
                    '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', 
                    '#607D8B', '#FFFFFF', '#000000']
  private colorFill = '#3F51B5'
  private lineWidth = 10

  constructor(private webSocketService: WebSocketService, private userService: UserService) {
    this.webSocketService.connect()
    this.socketSubscription = this.webSocketService.getTopic('canvas').subscribe((message: Command) => {
      if (this[message.fn])
        this[message.fn].apply(this, message.args)
    })
  }

  ngOnInit() {
    this.wrapper = document.getElementById('canvas-wrapper')
    this.canvas = new fabric.Canvas('canvas');
    this.onResize()
    window.addEventListener('resize', this.onResize.bind(this), false);

    this.canvas.on({
      'object:modified': this.onObjectModified.bind(this)
    })

  }

  onObjectModified(args) {
    console.log(args)
  }

  onResize() {
    this.canvas.setHeight(this.wrapper.clientHeight)
    this.canvas.setWidth(this.wrapper.clientWidth)
    this.canvas.renderAll();
  }

  toggleDrawingMode() {
    this.canvas.freeDrawingBrush.color = this.colorFill
    this.canvas.freeDrawingBrush.lineWidth = this.lineWidth
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode
  }

  
  addObjects(objects) {
    fabric.util.enlivenObjects(objects, objs => {
      var origRenderOnAddRemove = this.canvas.renderOnAddRemove;
      this.canvas.renderOnAddRemove = false;
      console.log(objs)
      this.canvas.add.apply(this.canvas, objs)    
      this.canvas.renderOnAddRemove = origRenderOnAddRemove;
      this.canvas.renderAll();
    });
  }

  removeObjects(ids) {
    this.canvas.remove.apply(this.canvas, this.canvas.getObjects().filter(obj => ids.includes(obj.id)))
  }

  modifyObjects(objects) {
  }

  drawObject(type, data) {
    if (!data) {
      data = this.getNewObjectData(type)
    }

    const shape = new fabric[type](data)
    this.canvas.add(shape)

    this.webSocketService.send({
      topic: 'canvas',
      fn: 'addObjects',
      args: [[shape.toObject(['id'])]]
    })
  }

  getNewObjectData(type) {
    const data: any = {
      id: this.userService.currentUser.id + '-' + Base64.fromNumber(Date.now()),
      width: 100,
      height: 100,
      left: this.wrapper.clientWidth / 2 - 50,
      top: this.wrapper.clientHeight / 2 - 50,
      fill: this.colorFill
    }

    if (type == 'Circle') {
      data.radius = data.height / 2
    }

    return data
  }

  setFillColor(color) {
    this.colorFill = color
    this.canvas.freeDrawingBrush.color = color
    const objects = this.canvas.getActiveObjects()
    objects.forEach(obj => obj.set('fill', this.colorFill))
    this.canvas.renderAll()
  }

  removeSelected() {
    const objects = this.canvas.getActiveObjects()
    this.canvas.discardActiveObject()
    this.canvas.remove.apply(this.canvas, objects)
    
    this.webSocketService.send({
      topic: 'canvas',
      fn: 'removeObjects',
      args: [objects.map(o => o.id)]
    })
  }

  handleDrop(e) {
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = (imgFile) => {
      console.log(imgFile)
      const data = imgFile.target["result"];
      fabric.Image.fromURL(data, (img) => {
        let oImg = img.set({
          left: 0,
          top: 0,
          angle: 0
        }).scale(1);
        this.canvas.add(oImg).renderAll();
        var a = this.canvas.setActiveObject(oImg);
        var dataURL = this.canvas.toDataURL({ format: 'png', quality: 0.8 });
      });
    };
    reader.readAsDataURL(file);

    return false;
  }

  toJSON() {
    return this.canvas.toJSON()
  }


}
