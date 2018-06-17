import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../user.service';
import { User, UserStatus } from '../models/User';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  userslist: User[] = []
  userStatus = UserStatus;

  constructor(public userService: UserService, public ref: ChangeDetectorRef) {
    this.userService.onChange(this.update.bind(this))
  }

  update() {
    console.log("updated", this.userslist)
    this.userslist = Array.from(this.userService.users.values())
    //this.ref.markForCheck()
  }

  ngOnInit() {
  }

}
