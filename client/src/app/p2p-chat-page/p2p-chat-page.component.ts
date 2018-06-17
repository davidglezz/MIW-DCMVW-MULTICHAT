import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { WebSocketService } from '../websocket.service';
import { P2pChatService } from '../p2p-chat.service';
import { ChatMessage } from '../models/ChatMessage';

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

  constructor(private p2pChatService: P2pChatService, private route: ActivatedRoute) {
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
      this.p2pChatService.sendMessage(this.remoteUser, text)
    }
  }
  
}
