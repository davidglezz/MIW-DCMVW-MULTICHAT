import { Injectable, OnDestroy } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { Subscription } from 'rxjs/Subscription';
import { Command } from './models/Command';
import { Router } from '@angular/router';
import { User, UserStatus, NewUser } from './models/User';
import { AppStorageService } from './AppStorage.service';

@Injectable()
export class UserService implements OnDestroy {
  public isLoggedIn = false // TODO poner private
  public currentUser: User
  private userSubscription: Subscription;

  constructor(private webSocketService: WebSocketService, private router: Router, private appStorage: AppStorageService) {
    this.userSubscription = this.webSocketService.subscribe('user', this)
  }

  public login(user: string, pass: string) {
    if (user && pass)
      this.webSocketService.send(new Command('user', 'login', [user, pass]))
  }

  public logout() {
    this.webSocketService.send(new Command('user', 'logout', [this.currentUser.id]))
    //this.requestAuth()
  }

  public register(user: string, pass: string) {
    if (user && pass)
      this.webSocketService.send(new Command('user', 'register', [user, pass]))
  }

  private loggedin(id: string, name: string, userlist?: User[]) {
    this.currentUser = NewUser(id, name);
    this.isLoggedIn = true
    if (userlist) {
      this.updateUserList(userlist)
    }
    this.router.navigate(['chat'])
  }

  private updateUserList(userlist: User[]) {
    this.appStorage.users.forEach((user, key, users) => {
      if (user.messages.find(m => m.type === 'text')) {
        user.status = UserStatus.Disconnected
      } else {
        users.delete(key)
      }
    })

    userlist.forEach(user => {
      if (user.name !== this.currentUser.name) {
        const connectedUser = this.appStorage.users.get(user.name)
        if (connectedUser) {
          connectedUser.status = UserStatus.Connected
        } else {
          this.appStorage.users.set(user.name, NewUser(user.id, user.name))
        }
      }
    });
    this.appStorage.notifyUsersChange()
  }

  private newUser(id: string, name: string) {
    this.appStorage.users.set(name, NewUser(id, name))
    this.appStorage.notifyUsersChange()
  }

  private userConnect(id: string, name: string) {
    const connectedUser = this.appStorage.users.get(name)
    if (connectedUser) {
      connectedUser.status = UserStatus.Connected
    } else {
      this.appStorage.users.set(name, NewUser(id, name))
    }
    this.appStorage.notifyUsersChange()
  }

  private userDisconnect(id: string, name: string) {
    const disconnectedUser = this.appStorage.users.get(name)
    if (disconnectedUser) {
      if (disconnectedUser.messages.find(m => m.type === 'text')) {
        disconnectedUser.status = UserStatus.Disconnected
      } else {
        this.appStorage.users.delete(name)
      }
      this.appStorage.notifyUsersChange()
    }
  }

  public requestAuth() {
    this.isLoggedIn = false
    this.currentUser = undefined
    this.appStorage.users = new Map<string, User>()
    this.router.navigate(['login'])
    this.appStorage.notifyUsersChange()
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
  }
}
