import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../game.models';

@Component({
  selector: 'spf-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() card: Card;
  @Input() selected: false;

  constructor() {}

  ngOnInit(): void {}

  //TODO find longest card text and ensure it fits
}
