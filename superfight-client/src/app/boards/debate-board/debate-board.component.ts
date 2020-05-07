import { Component, OnInit, Input } from '@angular/core';
import { Card } from 'src/app/game.models';

@Component({
  selector: 'spf-debate-board',
  templateUrl: './debate-board.component.html',
  styleUrls: ['./debate-board.component.scss'],
})
export class DebateBoardComponent implements OnInit {
  @Input() fighterA: Card[];
  @Input() fighterB: Card[];
  @Input() votable = false;

  constructor() {}

  ngOnInit(): void {}
}
