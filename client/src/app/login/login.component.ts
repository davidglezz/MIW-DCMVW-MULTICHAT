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
  constructor(private userService: UserService) { }

  login(user: string, pass: string) {
    if (user && pass)
      this.userService.login(user, pass);
  }

  register(user: string, pass: string) {
    if (user && pass)
      this.userService.register(user, pass);
  }
}
