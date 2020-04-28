import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserStateService } from '../user-state.service';
import { GameState } from '../game.models';

@Component({
  selector: 'spf-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss'],
})
export class GameScreenComponent implements OnInit {
  name: string;
  playerList = [];
  cards = [];
  isLeader = false;
  gameState: GameState;

  constructor(private socket: Socket, private userService: UserStateService) {}

  ngOnInit() {
    this.socket.connect();
    this.name = this.userService.getName();
    this.socket.emit('setName', this.name);
    this.socket.on('listPlayers', (playerList) => {
      this.playerList = playerList;
      this.isLeader = this.playerList[0].name === this.name;
    });
    this.socket.on('getCard', (card) => {
      this.cards.push(card);
    });
    this.socket.on('updateGameState', (gameState) => {
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
