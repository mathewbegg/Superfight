import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import {
  packageStartVoting,
  packageFighterSelection,
  UiState,
  BLANK_UI_STATE,
  Card,
  packageVote,
} from './models/game.models';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private uiState$: BehaviorSubject<UiState> = new BehaviorSubject<UiState>(
    BLANK_UI_STATE
  );

  constructor(private socket: Socket, private router: Router) {}

  connectToGame(name: string) {
    this.uiState$.next({
      ...this.uiState$.value,
      name: name,
    });
    this.router.navigateByUrl('/game');
    this.socket.connect();
    this.socket.emit('setName', this.uiState$.value.name);
    this.socket.on('listPlayers', (playerList) => {
      this.uiState$.next({
        ...this.uiState$.value,
        playerList: playerList,
        id: this.socket.ioSocket.id,
        isLeader: this.checkIfLeader(),
      });
    });
    this.socket.on('updatePublicState', (gameState) => {
      console.log('public state: ', gameState);
      this.uiState$.next({
        ...this.uiState$.value,
        gameState: gameState,
        isPlaying: this.checkIfPlaying(),
      });
    });
    this.socket.on('updatePrivateState', (privateState) => {
      console.log('private state: ', privateState);
      this.uiState$.next({
        ...this.uiState$.value,
        privateState: privateState,
        isPlaying: this.checkIfPlaying(),
      });
    });
  }

  getUiState(): Observable<UiState> {
    return this.uiState$.asObservable();
  }

  startVoting() {
    this.socket.emit('clientPackage', new packageStartVoting());
  }

  leaveGame() {
    this.router.navigateByUrl('');
    this.socket.disconnect();
  }

  newGame() {
    this.socket.emit('newGame');
  }

  selectWhiteCard(card: Card) {
    this.uiState$.next({
      ...this.uiState$.value,
      whiteSelection: card,
    });
  }

  selectBlackCard(card: Card) {
    this.uiState$.next({
      ...this.uiState$.value,
      blackSelection: card,
    });
  }

  lockInFighterSelection() {
    if (
      this.uiState$.value.whiteSelection &&
      this.uiState$.value.blackSelection
    ) {
      this.uiState$.next({
        ...this.uiState$.value,
        lockedIn: true,
      });
      this.socket.emit(
        'clientPackage',
        new packageFighterSelection({
          white: this.uiState$.value.whiteSelection,
          black: this.uiState$.value.blackSelection,
        })
      );
    }
  }

  sendVote(vote: string) {
    this.socket.emit('clientPackage', new packageVote(vote));
  }

  canActivate(): boolean {
    if (!this.uiState$.value.name || !this.uiState$.value.name.length) {
      this.router.navigateByUrl('');
      return false;
    }
    return true;
  }

  checkIfLeader() {
    return this.uiState$.value?.playerList?.filter(
      (player) => player.id === this.uiState$.value.id
    )[0]?.isLeader;
  }

  checkIfPlaying() {
    let phase;
    if ((phase = this.uiState$.value?.gameState?.phase)) {
      return (
        phase.playerA.id === this.uiState$.value.id ||
        phase.playerB.id === this.uiState$.value.id
      );
    }
  }
}

//TODO only go to game-screen upon connection
//TODO 'are you sure?' and info dialogs
//TODO Activity Feed
//TODO pick card from your hand cards.
