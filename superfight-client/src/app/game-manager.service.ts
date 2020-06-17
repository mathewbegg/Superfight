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
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { SpecialResolverService } from './special-resolver.service';

@Injectable({
  providedIn: 'root',
})
export class GameManagerService {
  private uiState$: BehaviorSubject<UiState> = new BehaviorSubject<UiState>(
    BLANK_UI_STATE
  );

  constructor(
    private socket: Socket,
    private router: Router,
    private specialResolver: SpecialResolverService
  ) {}

  connectToGame(name: string, roomName: string) {
    this.uiState$.next({
      ...this.uiState$.value,
      name: name,
      id: this.socket.ioSocket.id,
      roomName: roomName,
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
    this.uiState$.next({
      ...this.uiState$.value,
      roomName: '',
    });
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
    const whiteSelection = this.uiState$.value.whiteSelection;
    const blackSelection = this.uiState$.value.blackSelection;
    if (whiteSelection && blackSelection) {
      this.uiState$.next({
        ...this.uiState$.value,
        lockedIn: true,
      });
      if (!whiteSelection.specials && !blackSelection.specials) {
        this.sendFighterSelection();
      } else {
        this.resolveSpecials();
      }
    }
  }

  sendFighterSelection() {
    this.socket.emit(
      'commandToServer',
      new CommandFighterSelection({
        white: this.uiState$.value.whiteSelection,
        black: this.uiState$.value.blackSelection,
      })
    );
  }

  resolveSpecials() {
    const whiteSelection = this.uiState$.value.whiteSelection;
    const blackSelection = this.uiState$.value.blackSelection;
    let whiteReady = !whiteSelection.specials;
    let blackReady = !blackSelection.specials;
    let whiteSpecials$ = [];
    let blackSpecials$ = [];
    if (!whiteReady) {
      whiteSelection.specials.forEach((special) => {
        whiteSpecials$.push(
          this.specialResolver.resolveSpecial(special, this.uiState$.value)
        );
      });
      forkJoin(...whiteSpecials$).subscribe((res) => {
        res.forEach((text: string) => {
          whiteSelection.resolvedSpecial = whiteSelection.resolvedSpecial
            ? whiteSelection.resolvedSpecial.concat(` ${text}`)
            : text;
        });
        whiteReady = true;
        if (blackReady) {
          this.sendFighterSelection();
        }
      });
    }
    if (!blackReady) {
      blackSelection.specials.forEach((special) => {
        blackSpecials$.push(
          this.specialResolver.resolveSpecial(special, this.uiState$.value)
        );
      });
      forkJoin(...blackSpecials$).subscribe((res) => {
        res.forEach((text: string) => {
          blackSelection.resolvedSpecial = blackSelection.resolvedSpecial
            ? blackSelection.resolvedSpecial.concat(` ${text}`)
            : text;
        });
        blackReady = true;
        if (whiteReady) {
          this.sendFighterSelection();
        }
      });
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
