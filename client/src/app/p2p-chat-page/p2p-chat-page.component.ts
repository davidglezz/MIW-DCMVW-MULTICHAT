import { Component } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ChatMessage } from '../models/ChatMessage';
import { P2pChatService } from '../p2p-chat.service';

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
  private previousRoute  = ""
  
  constructor(private p2pChatService: P2pChatService, private route: ActivatedRoute, private router: Router) {
    //this.p2pchatSubscription = this.webSocketService.subscribe('p2pchat', this) // TODO auto scroll down on message
    this.route.params.subscribe(params => {
      p2pChatService.resetUnread(this.remoteUser)
      this.remoteUser = params['user']
      this.messages = p2pChatService.getMessagesOf(this.remoteUser)
      console.log('Remote user: ' + this.remoteUser)
    })

    this.router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        if (this.previousRoute.includes('/p2p-chat/')) {
          this.p2pChatService.resetUnread(this.remoteUser)
        }
        this.previousRoute = val.url;
      }
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
