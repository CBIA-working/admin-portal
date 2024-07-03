import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private logoutTimer: any;
  private readonly AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 seconds

  constructor(private router: Router) {
    this.startLogoutTimer();
  }

  // Check if the user is logged in by checking for the presence of the token
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Retrieve the token from localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Save the token to localStorage and start/restart the logout timer
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.resetLogoutTimer();
  }

  // Remove the token from localStorage and stop the logout timer
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.stopLogoutTimer();
    this.router.navigate(['/login']);
  }

  // Start the auto-logout timer
  private startLogoutTimer(): void {
    this.stopLogoutTimer();
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, this.AUTO_LOGOUT_TIME);
  }

  // Stop the auto-logout timer
  private stopLogoutTimer(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  // Reset the auto-logout timer
  public resetLogoutTimer(): void {
    this.startLogoutTimer();
  }

  // Logout the user
  private logout(): void {
    this.clearToken();
  }
}
