import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Base64 } from '../Base64';
import { UserService } from '../user.service';
import { WebSocketService } from '../websocket.service';

declare const fabric: any;

@Component({
  selector: 'app-canvas-page',
  templateUrl: './canvas-page.component.html',
  styleUrls: ['./canvas-page.component.css']
})
export class CanvasPageComponent implements OnInit, OnDestroy {
  loaded = false
  private canvasSubscription: Subscription
  private canvas
  private wrapper: HTMLElement
  private selectedObject = null
  colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688',
    '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E',
    '#607D8B', '#FFFFFF', '#000000']
  colorFill = '#3F51B5'
  private lineWidth = 10

  constructor(private webSocketService: WebSocketService, private userService: UserService) {
    this.canvasSubscription = this.webSocketService.subscribe('canvas', this)
  }

  ngOnInit() {
    this.wrapper = document.getElementById('canvas-wrapper')
    this.canvas = new fabric.Canvas('canvas');
    this.onResize()
    window.addEventListener('resize', this.onResize.bind(this), false);

    this.webSocketService.send({
      topic: 'canvas',
      fn: 'getCanvas',
      args: []
    })
  }

  setCanvas(json) {
    this.canvas.loadFromJSON(json, () => {
      this.canvas.requestRenderAll()
      this.canvas.on({
        'object:added': this.onObjectAdded.bind(this),
        'object:removed': this.onObjectRemoved.bind(this),
        'object:modified': this.onObjectModified.bind(this),
        'object:moving': this.onObjectModified.bind(this),
        'object:scaling': this.onObjectModified.bind(this),
        'object:rotating': this.onObjectModified.bind(this),
        'object:skewing': this.onObjectModified.bind(this),
        'object:selected': e => this.selectedObject = e.target,
        'object:cleared': () => this.selectedObject = null,
      })
      this.loaded = true
    })
  }

  onObjectAdded(args) {
    if (!args.target.id) {
      args.target.id = this.generateId()
      this.webSocketService.send({
        topic: 'canvas',
        fn: 'addObjects',
        args: [[args.target.toObject(['id', 'type'])]]
      })
    }
  }

  onObjectRemoved(args) {
    return
    /*this.webSocketService.send({
      topic: 'canvas',
      fn: 'removeObjects',
      args: [[args.target.id]]
    })*/
  }

  onObjectModified(args) {
    let data;
    if (args.target) {
      data = args.target.getObjects ? args.target.getObjects().map(o => o.toObject(['id'])) : [args.target.toObject(['id'])]
    } else {
      data = args.path ? [args.path.toObject(['id'])] : args.map(o => o.toObject(['id']))
    }

    this.webSocketService.send({
      topic: 'canvas',
      fn: 'modifyObjects',
      args: [data]
    })
  }

  onResize() {
    this.canvas.setHeight(this.wrapper.clientHeight)
    this.canvas.setWidth(this.wrapper.clientWidth)
    this.canvas.requestRenderAll();
  }

  toggleDrawingMode() {
    this.canvas.freeDrawingBrush.color = this.colorFill
    this.canvas.freeDrawingBrush.lineWidth = this.lineWidth
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode
  }

  addObjects(objects) {
    fabric.util.enlivenObjects(objects, objs => {
      const origRenderOnAddRemove = this.canvas.renderOnAddRemove
      this.canvas.renderOnAddRemove = false
      this.canvas.add.apply(this.canvas, objs)
      this.canvas.renderOnAddRemove = origRenderOnAddRemove
      this.canvas.requestRenderAll()
    })
  }

  removeObjects(ids) {
    this.canvas.remove.apply(this.canvas, this.canvas.getObjects().filter(obj => ids.includes(obj.id)))
  }

  modifyObjects(objects) {
    objects.forEach(obj => {
      const theObj = this.canvas.getObjects().find(o => o.id === obj.id)
      if (theObj) {
        theObj.set(obj)
      } // TODO else add
    })
    this.canvas.requestRenderAll()
  }

  drawObject(type, data) {
    this.canvas.add(new fabric[type](data || this.getNewObjectData(type)))
  }

  getNewObjectData(type) {
    const data: any = {
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

  generateId() {
    return this.userService.currentUser.id + '-' + Base64.fromNumber(Date.now())
  }

  setFillColor(color) {
    this.colorFill = color
    this.canvas.freeDrawingBrush.color = color
    const objects = this.canvas.getActiveObjects()
    objects.forEach(obj => obj.set('fill', this.colorFill))
    this.canvas.requestRenderAll()
    this.onObjectModified(objects)
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
    reader.onload = imgFile => {
      const data = imgFile.target["result"];
      fabric.Image.fromURL(data, img => {
        let oImg = img.set({
          left: 0,
          top: 0,
          angle: 0
        }).scale(1);
        this.canvas.add(oImg).requestRenderAll();
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

  ngOnDestroy() {
    this.canvasSubscription.unsubscribe()
  }
}
