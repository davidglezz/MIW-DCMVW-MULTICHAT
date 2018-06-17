import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule, MatToolbarModule, MatButtonModule, MatCheckboxModule, MatInputModule, MatCardModule, MatSlideToggleModule, MatSnackBarModule, MatSidenavModule, MatIconModule, MatListModule, MatProgressSpinnerModule } from '@angular/material';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { WebSocketService } from './websocket.service';
import { AppStorageService } from './AppStorage.service';
import { UserService } from './user.service';
import { P2pChatService } from './p2p-chat.service';
import { WebrtcCallService } from './webrtc-call.service';
import { P2pChatPageComponent } from './p2p-chat-page/p2p-chat-page.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './customReuseStrategy';
import { CanvasComponent } from './canvas/canvas.component';
import { MapValuesPipe } from './map-values.pipe';
import { UserListComponent } from './user-list/user-list.component';
import 'hammerjs';
import 'hammer-timejs';


@NgModule({
  declarations: [
    AppComponent,
    ChatPageComponent,
    LoginPageComponent,
    P2pChatPageComponent,
    CanvasComponent,
    MapValuesPipe,
    UserListComponent
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
    MatListModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  providers: [WebSocketService, AppStorageService, UserService, P2pChatService, WebrtcCallService, { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
