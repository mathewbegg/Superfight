import { OnInit, OnDestroy } from '@angular/core';
import { GameManagerService } from '../game-manager.service';
import { UiState } from './game.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export abstract class BaseUiStateComponent implements OnInit, OnDestroy {
  uiState: UiState;
  unsubscribe$ = new Subject<void>();

  constructor(protected gameManager: GameManagerService) {}

  ngOnInit(): void {
    this.gameManager
      .getUiState()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((uiState) => (this.uiState = uiState));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
