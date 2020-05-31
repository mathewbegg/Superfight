import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import {
  CommandStartVoting,
  CommandFighterSelection,
  CommandNewGame,
  Card,
  CommandVote,
  GameState,
  PhaseName,
  Player,
  GamePhase,
  PrivateState,
} from '../../../shared-models';
import { UiState, BLANK_UI_STATE } from './models/game.models';
import { CommandJoinRoom } from '../../../shared-models';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private uiState$: BehaviorSubject<UiState> = new BehaviorSubject<UiState>(
    BLANK_UI_STATE
  );

  constructor(private socket: Socket, private router: Router) {}

  connectToGame(name: string, roomName: string) {
    this.uiState$.next({
      ...this.uiState$.value,
      name: name,
      id: this.socket.ioSocket.id,
    });
    this.router.navigateByUrl('/game');
    this.socket.connect();
    this.socket.emit(
      'joinRoom',
      new CommandJoinRoom({
        player: { id: this.socket.ioSocket.id, name: this.uiState$.value.name },
        roomName: roomName,
      })
    );
    this.socket.on('updatePublicState', (gameState: GameState) => {
      console.log('public state: ', gameState);
      this.uiState$.next({
        ...this.uiState$.value,
        gameState: gameState,
        playerList: gameState.playerList,
        isLeader: this.checkIfLeader(gameState.playerList),
        isPlaying: this.checkIfPlaying(gameState.phase),
        isChampion: this.checkIfChampion(gameState.phase),
      });
    });
    this.socket.on('updatePrivateState', (privateState: PrivateState) => {
      console.log('private state: ', privateState);
      this.uiState$.next({
        ...this.uiState$.value,
        privateState: privateState,
      });
    });
  }

  getUiState(): Observable<UiState> {
    return this.uiState$.asObservable();
  }

  startVoting() {
    this.socket.emit('commandToServer', new CommandStartVoting());
  }

  leaveGame() {
    this.router.navigateByUrl('');
    this.socket.emit('leaveRoom');
  }

  newGame() {
    this.socket.emit('commandToServer', new CommandNewGame());
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
        'commandToServer',
        new CommandFighterSelection({
          white: this.uiState$.value.whiteSelection,
          black: this.uiState$.value.blackSelection,
        })
      );
    }
  }

  resetFighterIfNotChampion() {
    if (!this.uiState$.value.isChampion) {
      this.uiState$.next({
        ...this.uiState$.value,
        whiteSelection: null,
        blackSelection: null,
        lockedIn: false,
      });
    }
  }

  sendVote(vote: string) {
    this.socket.emit('commandToServer', new CommandVote(vote));
  }

  canActivate(): boolean {
    if (!this.uiState$.value.name || !this.uiState$.value.name.length) {
      this.router.navigateByUrl('');
      return false;
    }
    return true;
  }

  checkIfChampion(phase: GamePhase): boolean {
    return (
      this.uiState$.value?.id === phase?.playerA?.id && phase?.playerA?.champion
    );
  }

  checkIfLeader(playerList: Player[]): boolean {
    return (
      playerList.filter((player) => player.id === this.uiState$.value.id)[0]
        ?.isLeader || false
    );
  }

  checkIfPlaying(phase: GamePhase): boolean {
    return (
      phase?.phaseName !== PhaseName.WAITING &&
      (phase?.playerA?.id === this.uiState$.value.id ||
        phase?.playerB?.id === this.uiState$.value.id)
    );
  }
}

//TODO only go to game-screen upon connection
//TODO Activity Feed
//TODO pick card from your hand cards.
//TODO errors if not connected to server
//TODO save game
//TODO routing to game
//TODO cookies to remember players
