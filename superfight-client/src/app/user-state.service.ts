import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private name: string;

  constructor(private router: Router) {}

  connectToGame(name: string) {
    this.name = name;
    this.router.navigateByUrl('/game');
  }

  getName(): string {
    return this.name;
  }

  canActivate(): boolean {
    if (!this.name || !this.name.length) {
      this.router.navigateByUrl('');
      return false;
    }
    return true;
  }
}
