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
  EventName,
  CommandCreateRoom,
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
  ) {
    socket.connect();
  }

  subscribeToGameState() {
    this.socket.on(EventName.UPDATE_PUBLIC_STATE, (gameState: GameState) => {
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
    this.socket.on(
      EventName.UPDATE_PRIVATE_STATE,
      (privateState: PrivateState) => {
        console.log('private state: ', privateState);
        this.uiState$.next({
          ...this.uiState$.value,
          privateState: privateState,
        });
      }
    );
  }

  createGame(name: string) {
    this.socket.emit(EventName.CREATE_ROOM, new CommandCreateRoom());
    this.socket.on(EventName.CREATE_ROOM_SUCCESS, (roomCode: string) => {
      this.joinGame(name, roomCode);
    });
  }

  joinGame(name: string, roomCode: string) {
    this.uiState$.next({
      ...this.uiState$.value,
      name: name,
      id: this.socket.ioSocket.id,
      roomName: roomCode,
    });
    this.subscribeToGameState();
    this.socket.emit(
      EventName.JOIN_ROOM,
      new CommandJoinRoom(
        this.socket.ioSocket.id,
        this.uiState$.value.name,
        roomCode
      )
    );
    this.socket.on(EventName.JOIN_ROOM_SUCCESS, () => {
      this.router.navigateByUrl(`/game/${roomCode}`);
    });
  }

  getUiState(): Observable<UiState> {
    return this.uiState$.asObservable();
  }

  startVoting() {
    this.socket.emit(EventName.COMMAND_TO_SERVER, new CommandStartVoting());
  }

  leaveGame() {
    this.router.navigateByUrl('');
    this.uiState$.next({
      ...this.uiState$.value,
      roomName: '',
    });
    this.socket.emit(EventName.LEAVE_ROOM);
  }

  newGame() {
    this.socket.emit(EventName.COMMAND_TO_SERVER, new CommandNewGame());
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
      EventName.COMMAND_TO_SERVER,
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
    this.socket.emit(EventName.COMMAND_TO_SERVER, new CommandVote(vote));
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
