import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AreYouSureDialogComponent } from './are-you-sure-dialog/are-you-sure-dialog.component';
import { Observable } from 'rxjs';
import { InstructionDialogComponent } from './instruction-dialog/instruction-dialog.component';
import { CustomSpecialDialogComponent } from './custom-special-dialog/custom-special-dialog.component';
import { HandSpecialDialogComponent } from './hand-special-dialog/hand-special-dialog.component';
import { Card } from '../models/game.models';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  areYouSure(message = 'Are you sure?'): Observable<any> {
    const dialogRef = this.dialog.open(AreYouSureDialogComponent, {
      data: message,
    });

    return dialogRef.afterClosed();
  }

  openRules() {
    this.dialog.open(InstructionDialogComponent, { maxWidth: '700px' });
  }

  customSpecial() {
    const dialogRef = this.dialog.open(CustomSpecialDialogComponent);

    return dialogRef.afterClosed();
  }

  handSpecial(cards: Card[]) {
    const dialogRef = this.dialog.open(HandSpecialDialogComponent, {
      data: cards,
    });

    return dialogRef.afterClosed();
  }
}
