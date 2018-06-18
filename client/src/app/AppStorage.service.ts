import { Injectable, OnDestroy } from '@angular/core';
import { User } from './models/User';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AppStorageService implements OnDestroy {
  public users: Map<string, User> = new Map<string, User>()
  public usersChange: BehaviorSubject<Map<string, User>> = new BehaviorSubject(this.users);
  constructor() {  }

  notifyUsersChange() {
    this.usersChange.next(this.users);
  }

  ngOnDestroy() {
    //this.updateSubject.dispose();
  }
}
