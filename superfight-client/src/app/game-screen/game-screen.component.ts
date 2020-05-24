import { Component } from '@angular/core';
import { SelectionPair, PhaseName } from '../models/game.models';
import { GameManagerService } from '../game-manager.service';
import { Subject, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseUiStateComponent } from '../models/base-ui-state.component';

@Component({
  selector: 'spf-game-screen',
  templateUrl: './game-screen.component.html',
  styleUrls: ['./game-screen.component.scss'],
})
export class GameScreenComponent extends BaseUiStateComponent {
  SELECTING = PhaseName.SELECTING;
  DEBATING = PhaseName.DEBATING;
  VOTING = PhaseName.VOTING;
  WINNER = PhaseName.WINNER;
  TIEBREAKER = PhaseName.TIEBREAKER;

  constructor(protected gameManager: GameManagerService) {
    super(gameManager);
  }

  leaveGame() {
    this.gameManager.leaveGame();
  }

  newGame() {
    this.gameManager.newGame();
  }
}
