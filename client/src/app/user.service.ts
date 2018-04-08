import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Subscription } from 'rxjs/Subscription';
import { Command } from './models/Command';
import { Router } from '@angular/router';
import { User } from './models/User';

@Injectable()
export class UserService implements OnDestroy {
  public isLoggedIn = false
  public allUsers: User[] = []
  public currentUser: User
  private socketSubscription: Subscription;

  constructor(private webSocketService: WebSocketService, private router: Router) {
    this.webSocketService.connect()
    this.socketSubscription = this.webSocketService.getTopic('user').subscribe((message: Command) => {
      console.log(message)
      if (this[message.fn])
        this[message.fn].apply(this, message.args)
    })
    // this.webSocketService.send({msg:'Hello'})

    this.allUsers.push({id: 'test1', name: 'test1'});
    this.allUsers.push({id: 'test2', name: 'test2'});
  }

  public login(user: string, pass: string) {
    this.webSocketService.send({
      topic: 'user',
      fn: 'login',
      args: [user, pass]
    })
  }

  public logout() {
    this.webSocketService.send({
      topic: 'user',
      fn: 'logout',
      args: [this.currentUser.id]
    })
    this.currentUser = undefined;
    this.router.navigate(['login'])
  }

  public register(user: string, pass: string) {
    this.webSocketService.send({
      topic: 'user',
      fn: 'register',
      args: [user, pass]
    })
  }

  private loggedin(id: string, name: string) {
    this.currentUser = {id, name}
    this.isLoggedIn = true
    this.router.navigate(['chat'])
  }

  private newUser(id: string, name: string) {
    this.allUsers.push({id, name});
  }

  private userConnect(id: string, name: string) {
    this.allUsers.push({id, name});
  }

  private userDisconnect(id: string, name: string) {
    // TODO
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe()
  }
}
