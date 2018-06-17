import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { P2pChatService } from './p2p-chat.service';
import { UserService } from './user.service';
import { WebSocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  private alertSubscription: Subscription;
  constructor(public webSocketService: WebSocketService, public snackBar: MatSnackBar, public userService: UserService, public p2pchatService: P2pChatService) {
    this.alertSubscription = this.webSocketService.subscribe('alert', this)
  }

  ngOnInit() {
    if (!this.userService.isLoggedIn) {
      this.userService.requestAuth()
    }
  }

  showMessage(message) {
    this.snackBar.open(message, ' × ', {
      duration: 4000,
    });
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe()
  }
}
