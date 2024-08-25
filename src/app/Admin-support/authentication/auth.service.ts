import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private rememberMeKey = 'rememberMe';
  private logoutTimer: any;
  private readonly AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 minutes
  private encryptionKey = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'; 

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!this.getDecryptedData(this.tokenKey);
  }

  getToken(): string | null {
    return this.getDecryptedData(this.tokenKey);
  }

  setToken(token: string, rememberMe: boolean): void {
    this.setEncryptedData(this.tokenKey, token);
    this.setEncryptedData(this.rememberMeKey, rememberMe);
    this.manageLogoutTimer(!rememberMe); // Adjust timer based on the rememberMe value
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.rememberMeKey);
    sessionStorage.removeItem('user'); // Clear user data
    sessionStorage.removeItem('permissions');
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
    const rememberMe = this.getDecryptedData(this.rememberMeKey);
    if (!rememberMe) {
      this.startLogoutTimer();
    } else {
      this.stopLogoutTimer();
    }
  }

  private logout(): void {
    this.clearToken();
  }

  // Encryption helper functions
  private setEncryptedData(key: string, data: any): void {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
    localStorage.setItem(key, encryptedData);
  }

  private getDecryptedData(key: string): any {
    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) {
      return null;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (e) {
      return null; // Handle errors (e.g., wrong encryption key)
    }
  }
}
