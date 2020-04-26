import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserStateService } from '../user-state.service';

@Component({
  selector: 'spf-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.scss'],
})
export class HomeScreenComponent implements OnInit {
  name = '';

  constructor(private userService: UserStateService) {}

  ngOnInit() {}

  connect() {
    if (this.name.length) {
      this.userService.connectToGame(this.name);
    }
  }
}
