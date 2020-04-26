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

  constructor(private socket: Socket, private userService: UserStateService) {}

  ngOnInit() {
    this.name = this.userService.getName();
    this.socket.emit('setName', this.name);
    this.socket.on('listPlayers', (playerList) => {
      this.playerList = playerList;
    });
  }
}
