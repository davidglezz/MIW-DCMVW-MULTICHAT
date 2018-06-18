import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  sampleUsers = ['david', 'susana', 'ana', 'adrian', 'test']

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
