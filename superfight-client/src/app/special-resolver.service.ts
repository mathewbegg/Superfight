import { Injectable } from '@angular/core';
import { SpecialSource } from '../../../shared-models/shared-models';
import { DialogService } from './dialogs/dialog.service';
import { Observable, of } from 'rxjs';
import { UiState } from './models/game.models';

@Injectable({
  providedIn: 'root',
})
export class SpecialResolverService {
  constructor(private dialogService: DialogService) {}

  resolveSpecial(special: SpecialSource, uiState: UiState): Observable<string> {
    switch (special) {
      case SpecialSource.WHITEDECK:
        return this.resolveWhiteDeckSpecial(uiState);
        break;
      case SpecialSource.BLACKDECK:
        return this.resolveBlackDeckSpecial(uiState);
        break;
      case SpecialSource.WHITEHAND:
        return this.resolveWhiteHandSpecial(uiState);
        break;
      case SpecialSource.OPPONENT:
        return this.resolveOpponentSpecial(uiState);
        break;
      case SpecialSource.LEFTPLAYER:
        return this.resolveLeftPlayerSpecial(uiState);
        break;
      case SpecialSource.CUSTOM:
        return this.resolveCustomSpecial();
        break;
    }
  }

  resolveWhiteDeckSpecial(uiState: UiState) {
    return of('special result');
  }

  resolveBlackDeckSpecial(uiState: UiState): Observable<string> {
    return this.dialogService.handSpecial(uiState.privateState.blackOptions);
  }

  resolveWhiteHandSpecial(uiState: UiState): Observable<string> {
    return this.dialogService.handSpecial(uiState.privateState.whiteOptions);
  }

  resolveOpponentSpecial(uiState: UiState): Observable<string> {
    const phase = uiState.gameState.phase;
    return of(
      phase.playerA.id === uiState.id ? phase.playerB.name : phase.playerA.name
    );
  }

  resolveLeftPlayerSpecial(uiState: UiState): Observable<string> {
    const playerIndex = uiState.playerList.findIndex(
      (player) => player.id === uiState.id
    );
    const leftPlayerIndex =
      playerIndex === 0 ? uiState.playerList.length - 1 : playerIndex - 1;
    return of(uiState.playerList[leftPlayerIndex].name);
  }

  resolveCustomSpecial(): Observable<string> {
    return this.dialogService.customSpecial();
  }
}

//TODO nested special resolving
