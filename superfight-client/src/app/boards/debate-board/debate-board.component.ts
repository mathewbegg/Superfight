import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from 'src/app/models/game.models';
import { GameManagerService } from 'src/app/game-manager.service';
import { BaseUiStateComponent } from 'src/app/models/base-ui-state.component';

@Component({
  selector: 'spf-debate-board',
  templateUrl: './debate-board.component.html',
  styleUrls: ['./debate-board.component.scss'],
})
export class DebateBoardComponent extends BaseUiStateComponent {
  @Input() fighterA: Card[];
  @Input() fighterB: Card[];
  @Input() votable = false;
  @Output() vote = new EventEmitter<string>();
  currentVote = '';

  constructor(protected gameManager: GameManagerService) {
    super(gameManager);
  }

  setVote(fighter: string) {
    if (this.votable) {
      this.currentVote = fighter;
    }
  }

  lockVote() {
    if (this.currentVote === 'A' || this.currentVote === 'B') {
      this.vote.emit(this.currentVote);
    } else {
      console.error('you must select a fighter to vote for');
    }
  }
}
