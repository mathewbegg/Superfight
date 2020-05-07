import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectingBoardComponent } from './selecting-board/selecting-board.component';
import { CardsModule } from '../cards/cards.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DebateBoardComponent } from './debate-board/debate-board.component';

@NgModule({
  declarations: [SelectingBoardComponent, DebateBoardComponent],
  imports: [CommonModule, CardsModule, MatButtonModule, MatIconModule],
  exports: [SelectingBoardComponent, DebateBoardComponent],
})
export class BoardsModule {}
