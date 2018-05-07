import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { WebSocketService } from './websocket.service';
import { Subscription } from 'rxjs/Subscription';
import { Command } from './models/Command';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  private socketSubscription: Subscription;
  constructor(public webSocketService: WebSocketService, public snackBar: MatSnackBar, public userService: UserService) {
    this.webSocketService.connect()
    this.socketSubscription = this.webSocketService.getTopic('alert').subscribe((message: Command) => {
      if (this[message.fn])
        this[message.fn].apply(this, message.args)
    })
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
    this.socketSubscription.unsubscribe()
  }
}
