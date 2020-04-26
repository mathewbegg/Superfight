import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { GameScreenComponent } from './game-screen/game-screen.component';

const routes: Routes = [
  { path: '', component: HomeScreenComponent },
  { path: 'game', component: GameScreenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
