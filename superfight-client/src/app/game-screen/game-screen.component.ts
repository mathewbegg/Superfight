import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserStateService } from '../user-state.service';
import { GameState, Player } from '../game.models';

@Component({
  selector: 'spf-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss'],
})
export class GameScreenComponent implements OnInit {
  name: string;
  playerList: Player[] = [];
  cards = [];
  isLeader = false;
  gameState: any;

  constructor(private socket: Socket, private userService: UserStateService) {}

  ngOnInit() {
    this.socket.connect();
    this.name = this.userService.getName();
    this.socket.emit('setName', this.name);
    this.socket.on('listPlayers', (playerList) => {
      this.playerList = playerList;
      this.isLeader = this.playerList[0].name === this.name;
    });
    this.socket.on('updateGameState', (gameState) => {
      console.log(gameState);
      this.gameState = gameState;
    });
  }

  leaveGame() {
    this.userService.leaveGame();
    this.socket.disconnect();
  }

  newGame() {
    this.socket.emit('newGame');
  }
}
