import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Card, SelectionPair, UiState } from '../../models/game.models';
import { GameManagerService } from 'src/app/game-manager.service';
import { BaseUiStateComponent } from 'src/app/models/base-ui-state.component';

@Component({
  selector: 'spf-selecting-board',
  templateUrl: './selecting-board.component.html',
  styleUrls: ['./selecting-board.component.scss'],
})
export class SelectingBoardComponent extends BaseUiStateComponent {
  @Input() blackOptions: Card[];

  @Input() whiteOptions: Card[];

  @Output() selection = new EventEmitter<SelectionPair>();

  constructor(protected gameManager: GameManagerService) {
    super(gameManager);
  }

  lockIn() {
    this.gameManager.lockInFighterSelection();
  }

  selectWhite(card: Card) {
    this.gameManager.selectWhiteCard(card);
  }

  selectBlack(card: Card) {
    this.gameManager.selectBlackCard(card);
  }
}
