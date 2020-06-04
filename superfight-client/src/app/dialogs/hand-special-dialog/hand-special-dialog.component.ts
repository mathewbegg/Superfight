import { Component, OnInit, Input, Inject } from '@angular/core';
import { Card } from '../../../../../shared-models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'spf-hand-special-dialog',
  templateUrl: './hand-special-dialog.component.html',
  styleUrls: ['./hand-special-dialog.component.scss'],
})
export class HandSpecialDialogComponent implements OnInit {
  cards: Card[] = [];
  selectedCard: Card;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Card[]) {
    this.cards = data;
  }

  ngOnInit(): void {}

  selectCard(card: Card) {
    this.selectedCard = card;
  }
}
