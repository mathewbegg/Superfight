import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { appSocketConfig } from './socket-config';
import { FormsModule } from '@angular/forms';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { GameScreenComponent } from './game-screen/game-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomeScreenComponent,
    GameScreenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(appSocketConfig),
    FormsModule,
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
