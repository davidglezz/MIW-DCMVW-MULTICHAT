import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStorageService } from './AppStorage.service';
import { UserService } from './user.service';
import { WebSocketService } from './websocket.service';

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

  resetUnread(username: string) {
    
    const user = this.appStorage.users.get(username)
    if (user) {
      user.unreadMessages = 0
      console.log('Borrar mensajes ' + username, user.unreadMessages)
    }
  }

  message(username: string, text: string) {
    console.log(`Message en p2p-chat-service: ${username}: ${text}`)
    const user = this.appStorage.users.get(username)
    if (user) {
      user.messages.push({ type: 'text', name: username, text })
      user.unreadMessages++
    } else {
      console.log(`El usuario ${username} no reconocido le ha enviado: ${text}`)
    }
  }

  notify(username: string, text: string) {
    console.log(`Notify en p2p-chat-service: ${text}`)
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
