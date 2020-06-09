import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as env from '../../environments/environment';
import { GameManagerService } from '../game-manager.service';
import { FormControl, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

@Component({
  selector: 'spf-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent implements OnInit {
  name = '';
  roomName = '';

  constructor(private gameService: GameManagerService) {}

  ngOnInit() {
    if (!env.environment.production) {
      this.name =
        env.mockNames[Math.floor(Math.random() * env.mockNames.length)];
    }
  }

  connectToGame() {
    if (this.name.length && this.roomName.length) {
      this.gameService.connectToGame(this.name, this.roomName.toUpperCase());
    }
  }
}
