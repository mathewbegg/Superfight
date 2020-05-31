import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AreYouSureDialogComponent } from './are-you-sure-dialog/are-you-sure-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from './dialog.service';

@NgModule({
  declarations: [AreYouSureDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatButtonModule,
  ],
  providers: [
    DialogService,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
  ],
  exports: [AreYouSureDialogComponent],
  entryComponents: [AreYouSureDialogComponent],
})
export class DialogModule {}
