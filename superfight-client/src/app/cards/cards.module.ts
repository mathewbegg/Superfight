import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { CardGroupComponent } from './card-group/card-group.component';

@NgModule({
  declarations: [CardComponent, CardGroupComponent],
  imports: [CommonModule],
  exports: [CardComponent, CardGroupComponent],
})
export class CardsModule {}
