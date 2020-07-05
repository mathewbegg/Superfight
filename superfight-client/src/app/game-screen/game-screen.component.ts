import { Component } from '@angular/core';
import { PhaseName } from '../models/game.models';
import { GameManagerService } from '../game-manager.service';
import { BaseUiStateComponent } from '../models/base-ui-state.component';
import { DialogService } from '../dialogs/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    protected gameManager: GameManagerService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {
    super(gameManager);
  }

  leaveGame() {
    this.dialogService.areYouSure().subscribe((confirmLeave) => {
      if (confirmLeave) {
        this.gameManager.leaveGame();
      }
    });
  }

  newGameClicked() {
    if (this.uiState.gameState.phase.phaseName === PhaseName.WAITING) {
      this.newGame();
    } else {
      this.dialogService.areYouSure().subscribe((confirmNew) => {
        if (confirmNew) {
          this.newGame();
        }
      });
    }
  }

  newGame() {
    if (this.uiState.playerList.length < 3) {
      this.snackBar.open('You need at least 3 players', 'close', {
        duration: 3000,
        panelClass: 'spf-snackbar',
      });
    } else {
      this.gameManager.newGame();
    }
  }
}
