import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { GameScreenComponent } from './game-screen/game-screen.component';
import { GameManagerService } from './game-manager.service';

const routes: Routes = [
  { path: '', component: HomeScreenComponent },
  { path: 'join/:roomCode', component: HomeScreenComponent },
  {
    path: 'game/:roomCode',
    component: GameScreenComponent,
    canActivate: [GameManagerService],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
