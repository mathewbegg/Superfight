import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() vote = new EventEmitter<string>();
  currentVote = '';

  constructor() {}

  ngOnInit(): void {}

  setVote(fighter: string) {
    if (this.votable) {
      this.currentVote = fighter;
    }
  }

  lockVote() {
    if (this.currentVote === 'A' || this.currentVote === 'B') {
      this.vote.emit(this.currentVote);
    } else {
      console.error('you must select a fighter to vote for');
    }
  }
}
