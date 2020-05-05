import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../game.models';

@Component({
  selector: 'spf-selecting-board',
  templateUrl: './selecting-board.component.html',
  styleUrls: ['./selecting-board.component.scss'],
})
export class SelectingBoardComponent implements OnInit {
  @Input() blackOptions: Card[];

  @Input() whiteOptions: Card[];

  whiteSelection: Card;
  blackSelection: Card;

  constructor() {}

  ngOnInit(): void {}

  selectWhite(card: Card) {
    this.whiteSelection = card;
  }

  selectBlack(card: Card) {
    this.blackSelection = card;
  }
}
