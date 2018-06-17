import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { User, UserStatus } from '../models/User';
import { AppStorageService } from '../AppStorage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  userslist: User[] = []
  userStatus = UserStatus;
  usersUpdateSubscription: Subscription

  constructor(public appStorage: AppStorageService, public ref: ChangeDetectorRef) {  }

  ngOnInit() { 
    this.usersUpdateSubscription = this.appStorage.usersChange.subscribe(users => {
      console.log("updated", this.userslist)
      this.userslist = Array.from(users.values())
      // this.ref.markForCheck()
      // this.ref.tick();
      // this.ref.detectChanges();
    });
  }

}
