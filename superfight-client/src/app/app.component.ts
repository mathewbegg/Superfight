import { Component } from '@angular/core';
import { DialogService } from './dialogs/dialog.service';
import { BaseUiStateComponent } from './models/base-ui-state.component';
import { GameManagerService } from './game-manager.service';
import { ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute
  ) {
    super(gameManager);
  }

  openRules() {
    this.dialogService.openRules();
  }

  getRoomLink(): string {
    return window.location.origin + `/join/${this.uiState.roomName}`;
  }
}
