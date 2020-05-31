import { Component } from '@angular/core';
import { DialogService } from './dialogs/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'superfight-client';

  constructor(private dialogService: DialogService) {}

  openRules() {
    this.dialogService.openRules();
  }
}
