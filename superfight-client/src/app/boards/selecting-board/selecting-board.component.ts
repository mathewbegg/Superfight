import { Component } from '@angular/core';
import { Card } from '../../models/game.models';
import { GameManagerService } from '../../game-manager.service';
import { BaseUiStateComponent } from 'src/app/models/base-ui-state.component';

@Component({
  selector: 'spf-selecting-board',
  templateUrl: './selecting-board.component.html',
  styleUrls: ['./selecting-board.component.scss'],
})
export class SelectingBoardComponent extends BaseUiStateComponent {
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

  get championFighter() {
    return this.uiState.gameState.playerList.find(
      (player) => player.id === this.uiState.id
    ).selectedFighter;
  }
}
