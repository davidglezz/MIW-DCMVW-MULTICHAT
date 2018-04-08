import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log('Se salió de la sala de chat principal')
  }
}
