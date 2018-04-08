import { Component, OnInit } from '@angular/core';
//import fabric = require('fabric/fabric-impl');
declare const fabric: any;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  private canvas

  constructor() { }

  ngOnInit() {
    this.canvas = new fabric.Canvas('canvas');
    this.onResize()
    window.addEventListener('resize', this.onResize.bind(this), false);

    this.canvas.freeDrawingBrush.color = 'green';
    this.canvas.freeDrawingBrush.lineWidth = 10;
  }

  onResize() {
    const wrapper = document.getElementById('canvas-wrapper')
    const width = wrapper.clientWidth
    const height = wrapper.clientHeight
    this.canvas.setHeight(height)
    this.canvas.setWidth(width)
    this.canvas.renderAll();
  }

  addObject(type, data) {

  }

  drawObject(type, data) {

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

  stoJSON() {
    return this.canvas.toJSON()
  }


}
