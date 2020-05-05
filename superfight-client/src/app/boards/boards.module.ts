import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectingBoardComponent } from './selecting-board/selecting-board.component';
import { CardsModule } from '../cards/cards.module';

@NgModule({
  declarations: [SelectingBoardComponent],
  imports: [CommonModule, CardsModule],
  exports: [SelectingBoardComponent],
})
export class BoardsModule {}
