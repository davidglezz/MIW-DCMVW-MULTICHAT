import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { WebSocketService } from './websocket.service';
import { AppStorageService } from './AppStorage.service';
import { Command } from './models/Command';
import { UserService } from './user.service';
import { NewUser, UserStatus } from './models/User';

@Injectable({
  providedIn: 'root'
})
export class P2pChatService {
  private userSubscription: Subscription;
  private p2pchatSubscription: Subscription;
  
  constructor(private webSocketService: WebSocketService, private appStorage: AppStorageService, private userService: UserService) {
    this.userSubscription = this.webSocketService.subscribe('user', this)
    this.p2pchatSubscription = this.webSocketService.subscribe('p2pchat', this)
  }

  sendMessage(to: string, text: string) {
    const user = this.appStorage.users.get(to)
    if (!user || !text)
      return
    
    user.messages.push({
      type: 'text', 
      name: this.userService.currentUser.name, 
      text
    })
    this.webSocketService.send({
      topic: 'p2pchat',
      fn: 'message',
      args: [to, text]
    })
  }

  getMessagesOf(username: string) {
    const user = this.appStorage.users.get(username)
    if (user) {
      user.unreadMessages = 0
      return user.messages
    }
    return []
  }

  message(username, text) {
    console.log("message en p2p-chat-service")
    const user = this.appStorage.users.get(username)
    if (user) {
      user.messages.push({ type: 'text', name, text })
    } else {
      console.log(`El usuario ${username} no reconocido le ha enviado: ${text}`)
    }
  }

  notify(username, text) {
    console.log("notify en p2p-chat-service")
    const user = this.appStorage.users.get(username)
    if (user) {
      user.messages.push({ type: 'notify', text })
    } else {
      console.log(`El usuario ${username} no reconocido: ${text}`)
    }
  }

  // User events that afect to p2p messages
  private userConnect(id: string, name: string) {
    console.log("userConnect en p2p-chat-service")
    this.notify(name, name + ' se ha conectado.');
  }

  private userDisconnect(id: string, name: string) {
    this.notify(name, name + ' se ha desconectado.');
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
    this.p2pchatSubscription.unsubscribe()
  }
}
