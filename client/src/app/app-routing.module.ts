import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { P2pChatPageComponent } from './p2p-chat-page/p2p-chat-page.component';
import { CanvasPageComponent } from './canvas-page/canvas-page.component';
import { AboutPageComponent } from './about-page/about-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'chat',
    component: ChatPageComponent
  },
  {
    path: 'canvas',
    component: CanvasPageComponent
  },
  {
    path: 'p2p-chat/:user',
    component: P2pChatPageComponent
  },
  {
    path: 'about',
    component: AboutPageComponent
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