import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs/Subscription';
import { WebSocketService } from '../websocket.service';
import { Command } from '../models/Command';
import { ChatMessage } from '../models/ChatMessage';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  private chatSubscription: Subscription;
  private messages: ChatMessage[] = []

  constructor(private webSocketService: WebSocketService, private userService: UserService) {
    this.webSocketService.connect()
    this.userSubscription = this.webSocketService.getTopic('user').subscribe((message: Command) => {
      if (this[message.fn])
        this[message.fn].apply(this, message.args)
    })
    this.chatSubscription = this.webSocketService.getTopic('chat').subscribe((message: Command) => {
      if (this[message.fn])
        this[message.fn].apply(this, message.args)
    })
  }

  ngOnInit() {  }

  addMessage(type, name, text) {
    this.messages.push({type, name, text})
  }

  sendMessage(text) {
    if (text) {
      this.addMessage('text', this.userService.currentUser.name, text);
      this.webSocketService.send({
        topic: 'chat',
        fn: 'addMessage',
        args: [text]
      })
    }
  }

  private loggedin(id: string, name: string) {
    this.addMessage('notify', name, 'Te has conectado');
  }

  private requestAuth(id: string, name: string) {
    this.messages = [];
  }

  private newUser(id: string, name: string) {
    this.addMessage('notify', name, 'Dad la bienvenida a ' + name);
  }

  private userConnect(id: string, name: string) {
    this.addMessage('notify', name, name + ' se ha conectado.');
  }

  private userDisconnect(id: string, name: string) {
    this.addMessage('notify', name, name + ' se ha desconectado.');
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
    this.chatSubscription.unsubscribe()
    console.log('Salió de la sala de chat principal')
  }

}
