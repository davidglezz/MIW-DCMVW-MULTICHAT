import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Subscription } from 'rxjs/Subscription';
import { Command } from './models/Command';

@Injectable()
export class UserService implements OnDestroy {
  private socketSubscription: Subscription;
  id:string
  name:string

  constructor(private webSocketService: WebSocketService) {
    this.webSocketService.connect()
    this.socketSubscription = this.webSocketService.getTopic('user').subscribe((message: Command) => {
      console.log(message)
      if (this[message.fn])
        this[message.fn].apply(this, message.args)
    })

    // this.webSocketService.send({msg:'Hello'})
  }

  public login(user: string, pass: string) {
    console.log(user, pass);
    this.webSocketService.send({
      topic: 'user',
      fn: 'login',
      args: [user, pass]
    })
  }

  private loggedin(id: string, name: string) {
    console.log(id, name, this);
    this.id = id;
    this.name = name
  }

  public logout() {
    this.name = this.id = undefined;
    this.webSocketService.send({
      topic: 'user',
      fn: 'logout',
      args: [this.id]
    })
  }

  public register(user: string, pass: string) {
    console.log('Registar..');
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe()
  }
}
