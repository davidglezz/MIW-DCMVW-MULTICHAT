import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WebSocketService } from '../websocket.service';
import { Subscription } from 'rxjs/Subscription';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private socketSubscription: Subscription;

  constructor(private userService: UserService) { }


  login(user: string, pass: string) {
    this.userService.login(user, pass);
  }

  register(user: string, pass: string) {
    this.userService.register(user, pass);
  }

}
