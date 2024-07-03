import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private rememberMeKey = 'rememberMe';
  private logoutTimer: any;
  private readonly AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 minutes

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string, rememberMe: boolean): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.rememberMeKey, JSON.stringify(rememberMe));
    this.manageLogoutTimer(!rememberMe); // Adjust timer based on the rememberMe value
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.rememberMeKey);
    this.stopLogoutTimer();
    this.router.navigate(['/login']);
  }

  private manageLogoutTimer(activateTimer: boolean): void {
    if (activateTimer) {
      this.startLogoutTimer();
    } else {
      this.stopLogoutTimer();
    }
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
    const rememberMe = JSON.parse(localStorage.getItem(this.rememberMeKey) || 'false');
    if (!rememberMe) {
      this.startLogoutTimer();
    } else {
      this.stopLogoutTimer();
    }
  }

  private logout(): void {
    this.clearToken();
  }
}
