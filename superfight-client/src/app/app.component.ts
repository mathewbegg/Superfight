import { Component } from '@angular/core';
import { DialogService } from './dialogs/dialog.service';
import { BaseUiStateComponent } from './models/base-ui-state.component';
import { GameManagerService } from './game-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends BaseUiStateComponent {
  title = 'superfight-client';

  constructor(
    protected gameManager: GameManagerService,
    private dialogService: DialogService
  ) {
    super(gameManager);
  }

  openRules() {
    this.dialogService.openRules();
  }
}
