import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Subscription } from 'rxjs/Subscription';
import { Command } from './models/Command';
import { Router } from '@angular/router';
import { User } from './models/User';
import { AppStorageService } from './AppStorage.service';

@Injectable()
export class UserService implements OnDestroy {
  public isLoggedIn = false
  public allUsers: User[] = []
  public currentUser: User
  private socketSubscription: Subscription;

  constructor(private webSocketService: WebSocketService, private router: Router, private appStorage: AppStorageService) {
    this.users = appStorage.users;
    this.webSocketService.connect()
    this.socketSubscription = this.webSocketService.getTopic('user').subscribe((message: Command) => {
      if (this[message.fn])
        this[message.fn].apply(this, message.args)
    })
  }

  public getUsers(withCurrent = true) {
    return withCurrent ? this.allUsers : this.allUsers.filter(u => u.id != this.currentUser.id)
  }

  public login(user: string, pass: string) {
    if (!user || ! pass)
      return
    
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
    //this.requestAuth()
  }

  public register(user: string, pass: string) {
    if (!user || ! pass)
      return
    
    this.webSocketService.send({
      topic: 'user',
      fn: 'register',
      args: [user, pass]
    })
  }

  private loggedin(id: string, name: string, userlist?: User[]) {
    this.currentUser = { id, name }
    this.isLoggedIn = true
    if (userlist) {
      this.updateUserList(userlist)
    }
    this.router.navigate(['chat'])
  }

  private updateUserList(userlist: User[]) {
    this.allUsers = userlist
  }

  private newUser(id: string, name: string) {
    this.allUsers.push({ id, name })
  }

  private userConnect(id: string, name: string) {
    this.allUsers.push({ id, name })
  }

  private userDisconnect(id: string, name: string) {
    this.allUsers = this.allUsers.filter(u => u.name !== name)
  }

  public requestAuth() {
    this.isLoggedIn = false
    this.currentUser = undefined
    this.allUsers = []
    this.router.navigate(['login'])
  }

  ngOnDestroy() {
    this.socketSubscription.unsubscribe()
  }
}
