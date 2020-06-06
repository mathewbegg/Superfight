import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../models/game.models';

@Component({
  selector: 'spf-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() card: Card;
  @Input() selectable = true;
  @Input() selected = false;
  @Input() blankSlot = false;
  @Output() select = new EventEmitter<Card>();

  constructor() {}

  ngOnInit(): void {}

  selectCard() {
    if (this.card) {
      this.select.emit(this.card);
    }
  }

  /**Returns a display string stripped of any !WHITE_DECK and !BLACK_DECK tokens*/
  display(text: string) {
    return text?.replace(/!WHITE_DECK|!BLACK_DECK/gm, '');
  }

  //TODO find longest card text and ensure it fits
}
