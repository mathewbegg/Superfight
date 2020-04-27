import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { UserStateService } from '../user-state.service';

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
  }

  leaveGame() {
    this.userService.leaveGame();
    this.socket.disconnect();
  }

  drawWhite() {
    this.socket.emit('drawWhite');
  }
}
