import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as env from '../../environments/environment';
import { GameManagerService } from '../game-manager.service';

@Component({
  selector: 'spf-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent implements OnInit {
  name = '';

  constructor(private gameService: GameManagerService) {}

  ngOnInit() {
    if (!env.environment.production) {
      this.name =
        env.mockNames[Math.floor(Math.random() * env.mockNames.length)];
    }
  }

  connect() {
    if (this.name.length) {
      this.gameService.connectToGame(this.name);
    }
  }

  //TODO style home screen
  //TODO name restrictions
}
