import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { GameManagerService } from '../game-manager.service';

@Component({
  selector: 'spf-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent implements OnInit {
  name = '';
  roomCode = '';
  urlContainsRoomCode = false;

  constructor(
    private gameService: GameManagerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (!environment.production) {
      this.name =
        environment.mockNames[
          Math.floor(Math.random() * environment.mockNames.length)
        ];
    }
    const roomCode = this.route.snapshot.paramMap.get('roomCode');
    if (roomCode) {
      this.roomCode = roomCode;
      this.urlContainsRoomCode = true;
    }
  }

  joinGame() {
    if (this.name.length && this.roomCode.length) {
      this.gameService.joinGame(this.name, this.roomCode.toUpperCase());
    }
  }

  createGame() {
    this.gameService.createGame(this.name);
  }
}
