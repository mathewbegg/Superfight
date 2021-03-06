import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { GameManagerService } from '../game-manager.service';
import { FormControl, Validators } from '@angular/forms';
import { CardsModule } from '../cards/cards.module';
import { Card, CardColor } from '../models/game.models';

@Component({
  selector: 'spf-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent implements OnInit {
  urlContainsRoomCode = false;
  selectState = 'selecting';
  nameForm = new FormControl('', [
    Validators.required,
    Validators.maxLength(16),
  ]);
  roomCodeForm = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
    Validators.maxLength(4),
  ]);
  joinRoomCard: Card = {
    color: 'white',
    text: 'Join Room',
  };
  createRoomCard: Card = {
    color: 'black',
    text: 'Create Room',
  };

  constructor(
    private gameService: GameManagerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (!environment.production) {
      this.nameForm.setValue(
        environment.mockNames[
          Math.floor(Math.random() * environment.mockNames.length)
        ]
      );
    }
    const roomCode = this.route.snapshot.paramMap.get('roomCode');
    if (roomCode) {
      this.roomCodeForm.setValue(roomCode);
      this.urlContainsRoomCode = true;
      this.selectState = 'joining';
    }
  }

  setSelectState(view: string) {
    this.selectState = view;
  }

  joinGame() {
    if (this.nameForm.valid && this.roomCodeForm.valid) {
      this.gameService.joinGame(
        this.nameForm.value,
        this.roomCodeForm.value.toUpperCase()
      );
    } else {
      this.nameForm.markAsTouched();
      this.roomCodeForm.markAsTouched();
    }
  }

  createGame() {
    if (this.nameForm.valid) {
      this.gameService.createGame(this.nameForm.value);
    } else {
      this.nameForm.markAsTouched();
    }
  }
}
