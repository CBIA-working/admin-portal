import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityMonitorService {
  constructor(private authService: AuthService) {
    this.initActivityListener();
  }

  // Initialize activity listeners
  private initActivityListener(): void {
    ['mousemove', 'click', 'keypress'].forEach(event => {
      window.addEventListener(event, () => this.resetLogoutTimer());
    });
  }

  // Reset the logout timer on user activity
  private resetLogoutTimer(): void {
    this.authService.resetLogoutTimer();
  }
}
