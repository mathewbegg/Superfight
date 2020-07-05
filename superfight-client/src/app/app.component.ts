import { Component } from '@angular/core';
import { DialogService } from './dialogs/dialog.service';
import { BaseUiStateComponent } from './models/base-ui-state.component';
import { GameManagerService } from './game-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseUiStateComponent {
  title = 'superfight-client';

  constructor(
    protected gameManager: GameManagerService,
    private dialogService: DialogService,
    private snackBar: MatSnackBar
  ) {
    super(gameManager);
  }

  openRules() {
    this.dialogService.openRules();
  }

  displayCopiedMessage() {
    this.snackBar.open('Link Copied', 'close', {
      duration: 1000,
      panelClass: 'spf-snackbar',
    });
  }

  getRoomLink(): string {
    return window.location.origin + `/join/${this.uiState.roomName}`;
  }
}
