import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { LoginComponent } from './login/login.component';
import { P2pChatComponent } from './p2p-chat/p2p-chat.component';
import { CanvasComponent } from './canvas/canvas.component';

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
    path: 'canvas',
    component: CanvasComponent
  },
  {
    path: 'p2p-chat/:user',
    component: P2pChatComponent
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