import { Card } from '../../../shared-models';
import * as _ from 'lodash';

export class Deck {
  private cards: Card[];
  private discardPile: Card[] = [];

  constructor(cards: Card[], shuffle = true) {
    if (shuffle) {
      this.shuffle();
    } else {
      this.cards = cards;
    }
  }

  drawCard(): Card {
    if (!this.cards.length) {
      this.shuffle();
      console.log('Deck depleted. Shuffling discard pile.');
    }
    const card = this.cards.pop();
    this.discardPile.push(card);
    return card;
  }

  shuffle() {
    this.cards = _.shuffle([...this.cards, ...this.discardPile]);
  }

  getDiscardPile(): Card[] {
    return this.discardPile;
  }
}
