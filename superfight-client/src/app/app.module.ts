import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule } from 'ngx-socket-io';
import { appSocketConfig } from './socket-config';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { GameScreenComponent } from './game-screen/game-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CardsModule } from './cards/cards.module';
import { BoardsModule } from './boards/boards.module';
import { WinnerBoardComponent } from './boards/winner-board/winner-board.component';
import { DialogModule } from './dialogs/dialog.module';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    HomeScreenComponent,
    GameScreenComponent,
    WinnerBoardComponent,
  ],
  imports: [
    CardsModule,
    BoardsModule,
    DialogModule,
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(appSocketConfig),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ClipboardModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
