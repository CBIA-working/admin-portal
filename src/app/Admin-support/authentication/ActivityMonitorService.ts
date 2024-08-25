import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityMonitorService implements OnDestroy {
  private events: string[] = ['mousemove', 'click', 'keypress'];
  private boundResetLogoutTimer: any;  // Storing the bound function reference

  constructor(private authService: AuthService) {
    this.boundResetLogoutTimer = this.resetLogoutTimer.bind(this);  // Bind the method
    this.initActivityListener();  // Initialize listeners
  }

  // Initialize activity listeners
  private initActivityListener(): void {
    this.events.forEach(event => {
      window.addEventListener(event, this.boundResetLogoutTimer, true);  // Add listeners with the bound method
    });
  }

  // Reset the logout timer on user activity
  private resetLogoutTimer(): void {
    this.authService.resetLogoutTimer();
  }

  // Unregister all event listeners when the service instance is destroyed
  ngOnDestroy(): void {
    this.events.forEach(event => {
      window.removeEventListener(event, this.boundResetLogoutTimer, true);  // Remove listeners using the same bound method reference
    });
  }
}
