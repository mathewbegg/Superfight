import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card, PhaseName } from 'src/app/models/game.models';
import { GameManagerService } from 'src/app/game-manager.service';
import { BaseUiStateComponent } from 'src/app/models/base-ui-state.component';

@Component({
  selector: 'spf-debate-board',
  templateUrl: './debate-board.component.html',
  styleUrls: ['./debate-board.component.scss'],
})
export class DebateBoardComponent extends BaseUiStateComponent {
  DEBATING = PhaseName.DEBATING;
  votable: boolean;
  currentVote = '';

  constructor(protected gameManager: GameManagerService) {
    super(gameManager);
  }

  ngOnInit() {
    super.ngOnInit();
    this.votable =
      this.uiState.gameState.phase.phaseName === PhaseName.VOTING &&
      !this.uiState?.isPlaying;
  }

  startVoting() {
    this.gameManager.startVoting();
  }

  setVote(fighter: string) {
    if (this.votable) {
      this.currentVote = fighter;
    }
  }

  castVote() {
    if (this.currentVote) {
      this.votable = false;
      this.gameManager.sendVote(this.currentVote);
    }
  }

  get isLeader(): boolean {
    return this.uiState?.isLeader;
  }
}
