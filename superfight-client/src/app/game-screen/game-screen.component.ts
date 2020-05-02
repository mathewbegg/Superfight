import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserStateService } from '../user-state.service';
import { GameState, Player } from '../game.models';
import { state } from '@angular/animations';

@Component({
  selector: 'spf-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss'],
})
export class GameScreenComponent implements OnInit {
  name: string;
  id: string;
  playerList: Player[] = [];
  cards = [];
  isLeader = false;
  gameState: any;
  privateState: any;

  constructor(private socket: Socket, private userService: UserStateService) {}

  ngOnInit() {
    this.socket.connect();
    this.name = this.userService.getName();
    this.socket.emit('setName', this.name);
    this.socket.on('listPlayers', (playerList) => {
      this.id = this.socket.ioSocket.id;
      this.playerList = playerList;
      this.isLeader = this.playerList.filter(
        (player) => player.id === this.id
      )[0]?.isLeader;
    });
    this.socket.on('updateGameState', (gameState) => {
      console.log(gameState);
      this.gameState = gameState;
    });
    this.socket.on('updatePrivateState', (privateState) => {
      console.log(privateState);
      this.privateState = privateState;
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
