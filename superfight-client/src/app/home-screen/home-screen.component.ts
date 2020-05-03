import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserStateService } from '../user-state.service';
import * as env from '../../environments/environment';

@Component({
  selector: 'spf-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent implements OnInit {
  name = '';

  constructor(private userService: UserStateService) {}

  ngOnInit() {
    if (!env.environment.production) {
      this.name =
        env.mockNames[Math.floor(Math.random() * env.mockNames.length)];
    }
  }

  connect() {
    if (this.name.length) {
      this.userService.connectToGame(this.name);
    }
  }

  //TODO style home screen
}
