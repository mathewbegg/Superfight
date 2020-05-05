import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card, SelectionPair } from '../../game.models';

@Component({
  selector: 'spf-selecting-board',
  templateUrl: './selecting-board.component.html',
  styleUrls: ['./selecting-board.component.scss'],
})
export class SelectingBoardComponent implements OnInit {
  @Input() blackOptions: Card[];

  @Input() whiteOptions: Card[];

  @Output() selection = new EventEmitter<SelectionPair>();

  whiteSelection: Card;
  blackSelection: Card;
  lockedIn = false;

  constructor() {}

  ngOnInit(): void {}

  lockIn() {
    if (this.whiteSelection && this.blackSelection) {
      this.selection.emit({
        white: this.whiteSelection,
        black: this.blackSelection,
      });
      this.lockedIn = true;
    } else {
      console.log('You must select both black and white cards to lock in');
    }
  }

  selectWhite(card: Card) {
    this.whiteSelection = card;
  }

  selectBlack(card: Card) {
    this.blackSelection = card;
  }
}
