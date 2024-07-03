import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private logoutTimer: any;
  private readonly AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 minutes

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Retrieved token:', token); // For debugging
    return token;
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    console.log('Token set:', token); // For debugging
    this.resetLogoutTimer();
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    console.log('Token cleared'); // For debugging
    this.stopLogoutTimer();
    this.router.navigate(['/login']);
  }

  private startLogoutTimer(): void {
    this.stopLogoutTimer();
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, this.AUTO_LOGOUT_TIME);
  }

  private stopLogoutTimer(): void {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  public resetLogoutTimer(): void {
    this.startLogoutTimer();
  }

  private logout(): void {
    this.clearToken();
  }
}
