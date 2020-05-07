import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../game.models';

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

  //TODO find longest card text and ensure it fits
}
