import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatCardModule, MatSlideToggleModule, MatSnackBarModule, MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { LoginComponent } from './login/login.component';
import { WebSocketService } from './websocket.service';
import { UserService } from './user.service';
import { P2pChatComponent } from './p2p-chat/p2p-chat.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './CustomReuseStrategy';
import { CanvasComponent } from './canvas/canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatPageComponent,
    LoginComponent,
    P2pChatComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [WebSocketService, UserService, { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
