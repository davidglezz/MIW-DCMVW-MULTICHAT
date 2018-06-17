import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { WebSocketService } from '../websocket.service';
import { P2pChatService } from '../p2p-chat.service';
import { ChatMessage } from '../models/ChatMessage';
import { Subscription } from 'rxjs/Subscription';

/**
 * Debido a que la API RTCDataChannel (https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel)
 * todavía es poco soportada por los navegadores, los mensajes de texto serán enviados mediante websokets.
 */
@Component({
  selector: 'app-p2p-chat-page',
  templateUrl: './p2p-chat-page.component.html',
  styleUrls: ['./p2p-chat-page.component.css']
})
export class P2pChatPageComponent {
  messages: ChatMessage[] = []
  remoteUser: string
  //private p2pchatSubscription: Subscription;
  
  constructor(private p2pChatService: P2pChatService, private route: ActivatedRoute) {
    //this.p2pchatSubscription = this.webSocketService.subscribe('p2pchat', this) // TODO auto scroll down on message
    this.route.params.subscribe(params => {
      this.remoteUser = params['user']
      this.messages = p2pChatService.getMessagesOf(this.remoteUser)
      console.log('Remote user: ' + this.remoteUser)
    })
  }

  call() {
    console.info("Call..")
  }

  sendMessage(text) {
    if (text) {
      const list = document.querySelector('.message-list');
      list.scrollTop = list.scrollHeight;
      //list.lastChild.scrollIntoView(false);
      this.p2pChatService.sendMessage(this.remoteUser, text)
    }
  }

}
