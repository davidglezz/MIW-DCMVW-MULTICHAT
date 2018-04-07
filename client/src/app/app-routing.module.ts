import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'chat',
    component: ChatPageComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'chat'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }