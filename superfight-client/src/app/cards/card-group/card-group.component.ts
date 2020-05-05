import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from 'src/app/game.models';

@Component({
  selector: 'spf-card-group',
  templateUrl: './card-group.component.html',
  styleUrls: ['./card-group.component.scss'],
})
export class CardGroupComponent implements OnInit {
  @Input() cards: Card[];

  @Output() cardSelected = new EventEmitter<Card>();

  selectedCard: Card;

  constructor() {}

  ngOnInit(): void {}

  selectCard(card: Card) {
    this.selectedCard = card;
    this.cardSelected.emit(card);
  }
}
