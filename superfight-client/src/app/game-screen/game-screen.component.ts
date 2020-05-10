import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  GameState,
  Player,
  Card,
  SelectionPair,
  packageFighterSelection,
  packageStartVoting,
  UiState,
  BLANK_UI_STATE,
} from '../game.models';
import { GameManagerService } from '../game-manager.service';
import { Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'spf-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss'],
})
export class GameScreenComponent implements OnInit, OnDestroy {
  uiState: UiState;
  unsubscribe$ = new Subject<void>();

  constructor(private gameManager: GameManagerService) {}

  ngOnInit() {
    this.gameManager
      .getUiState()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((uiState) => (this.uiState = uiState));
  }

  startVoting() {
    this.gameManager.startVoting();
  }

  leaveGame() {
    this.gameManager.leaveGame();
  }

  newGame() {
    this.gameManager.newGame();
  }

  selectFighter(selection: SelectionPair) {
    this.gameManager.selectFighter(selection);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  //TODO 'are you sure?' and info dialogs
  //TODO Activity Feed
  //TODO pick card from your hand cards.
}
