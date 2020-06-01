import { Injectable } from '@angular/core';
import { SpecialSource } from '../../../shared-models/shared-models';
import { DialogService } from './dialogs/dialog.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpecialResolverService {
  constructor(private dialogService: DialogService) {}

  resolveSpecial(special: SpecialSource): Observable<string> {
    switch (special) {
      case SpecialSource.WHITEDECK:
        return this.resolveWhiteDeckSpecial();
        break;
      case SpecialSource.BLACKDECK:
        return this.resolveBlackDeckSpecial();
        break;
      case SpecialSource.WHITEHAND:
        return this.resolveWhiteHandSpecial();
        break;
      case SpecialSource.OPPONENT:
        return this.resolveOpponentSpecial();
        break;
      case SpecialSource.LEFTPLAYER:
        return this.resolveLeftPlayerSpecial();
        break;
      case SpecialSource.CUSTOM:
        return this.resolveCustomSpecial();
        break;
    }
  }

  resolveWhiteDeckSpecial(): Observable<string> {
    return of('special result');
  }
  resolveBlackDeckSpecial(): Observable<string> {
    return of('special result');
  }
  resolveWhiteHandSpecial(): Observable<string> {
    return of('special result');
  }
  resolveOpponentSpecial(): Observable<string> {
    return of('special result');
  }
  resolveLeftPlayerSpecial(): Observable<string> {
    return of('special result');
  }
  resolveCustomSpecial(): Observable<string> {
    return this.dialogService.customSpecial();
  }
}
