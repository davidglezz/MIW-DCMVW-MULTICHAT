import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Subscription } from 'rxjs/Subscription';
import { Command } from './models/Command';
import { Router } from '@angular/router';

@Injectable()
export class UserService implements OnDestroy {
  private socketSubscription: Subscription;
  id:string
  name:string

  constructor(private webSocketService: WebSocketService, private router:Router) {
    this.webSocketService.connect()
    this.socketSubscription = this.webSocketService.getTopic('user').subscribe((message: Command) => {
      console.log(message)
      if (this[message.fn])
        this[message.fn].apply(this, message.args)
    })

    // this.webSocketService.send({msg:'Hello'})
  }

  public login(user: string, pass: string) {
    this.webSocketService.send({
      topic: 'user',
      fn: 'login',
      args: [user, pass]
    })
  }

  private loggedin(id: string, name: string) {
    console.log("Sesion iniciada", id, name);
    this.id = id
    this.name = name
    this.router.navigate(['chat'])
  }

  public logout() {
    this.name = this.id = undefined;
    this.webSocketService.send({
      topic: 'user',
      fn: 'logout',
      args: [this.id]
    })
    this.router.navigate(['login'])
  }

  public register(user: string, pass: string) {
    this.webSocketService.send({
      topic: 'user',
      fn: 'register',
      args: [user, pass]
    })
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe()
  }
}
