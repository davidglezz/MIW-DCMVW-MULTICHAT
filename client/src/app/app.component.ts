import { Component, OnDestroy } from '@angular/core';
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
export class AppComponent implements OnDestroy {
  private socketSubscription: Subscription;
  constructor(private webSocketService: WebSocketService, private snackBar: MatSnackBar, private userService: UserService) {
    this.webSocketService.connect()
    this.socketSubscription = this.webSocketService.getTopic('alert').subscribe((message: Command) => {
      if (this[message.fn])
        this[message.fn].apply(this, message.args)
    })
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
