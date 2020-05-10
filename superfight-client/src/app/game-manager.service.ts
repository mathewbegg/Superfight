import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import {
  Player,
  packageStartVoting,
  SelectionPair,
  packageFighterSelection,
  GameState,
  PrivateState,
  UiState,
  BLANK_UI_STATE,
  GamePhase,
} from './game.models';
import { Observable, of, BehaviorSubject } from 'rxjs';

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

  selectFighter(selection: SelectionPair) {
    this.socket.emit('clientPackage', new packageFighterSelection(selection));
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
