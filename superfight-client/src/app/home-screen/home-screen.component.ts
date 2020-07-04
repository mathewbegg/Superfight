import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
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
    if (!environment.production) {
      this.name =
        environment.mockNames[
          Math.floor(Math.random() * environment.mockNames.length)
        ];
    }
  }

  joinGame() {
    if (this.name.length && this.roomName.length) {
      this.gameService.joinGame(this.name, this.roomName.toUpperCase());
    }
  }

  createGame() {
    this.gameService.createGame(this.name);
  }
}
