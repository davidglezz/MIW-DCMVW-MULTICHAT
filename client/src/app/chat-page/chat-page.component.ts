import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage } from '../models/ChatMessage';
import { UserService } from '../user.service';
import { WebSocketService } from '../websocket.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  private chatSubscription: Subscription;
  messages: ChatMessage[] = []

  constructor(private webSocketService: WebSocketService, private userService: UserService) {
    this.userSubscription = this.webSocketService.subscribe('user', this)
    this.chatSubscription = this.webSocketService.subscribe('chat', this)
  }

  ngOnInit() {  }

  message(name, text) {
    this.messages.push({type: 'text', name, text})
  }

  notify(text) {
    this.messages.push({type: 'notify', text})
  }

  sendMessage(text) {
    if (text) {
      this.message(this.userService.currentUser.name, text);
      this.webSocketService.send({
        topic: 'chat',
        fn: 'message',
        args: [text]
      })
    }
  }

  private loggedin(id: string, name: string) {
    this.notify('Te has conectado');
  }

  private requestAuth(id: string, name: string) {
    this.messages = [];
  }

  private newUser(id: string, name: string) {
    this.notify('Dad la bienvenida a ' + name);
  }

  private userConnect(id: string, name: string) {
    this.notify(name + ' se ha conectado.');
  }

  private userDisconnect(id: string, name: string) {
    this.notify(name + ' se ha desconectado.');
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
    this.chatSubscription.unsubscribe()
    console.log('Salió de la sala de chat principal')
  }

}
