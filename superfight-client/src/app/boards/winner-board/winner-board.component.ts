import { Component } from '@angular/core';
import { BaseUiStateComponent } from 'src/app/models/base-ui-state.component';
import { GameManagerService } from '../../game-manager.service';
import { PhaseName } from '../../../../../shared-models';

@Component({
  selector: 'spf-winner-board',
  templateUrl: './winner-board.component.html',
  styleUrls: ['./winner-board.component.scss'],
})
export class WinnerBoardComponent extends BaseUiStateComponent {
  WINNER = PhaseName.WINNER;
  TIEBREAKER = PhaseName.TIEBREAKER;

  constructor(protected gameManager: GameManagerService) {
    super(gameManager);
  }

  ngOnInit() {
    super.ngOnInit();
    this.gameManager.resetFighterIfNotChampion();
  }
}
