import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../auth.service';

interface LoginResponse {
  message: string;
  token: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, PasswordModule, ButtonModule, RippleModule, CheckboxModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  authForm: FormGroup;
  loginHasError: boolean = false;
  passwordHasError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    this.authForm = this.fb.group({
      email: ['knanda3001@gmail.com', Validators.required],
      password: ['Pass@12', Validators.required]
    });
  }
  ngOnInit(): void {
    // Ensure the user is logged out if already logged in
    if (this.authService.isLoggedIn()) {
      this.authService.clearToken();
    }
  }
  async onLogin() {
    if (this.authForm.invalid) {
      this.loginHasError = this.authForm.controls['email'].invalid;
      this.passwordHasError = this.authForm.controls['password'].invalid;
      return;
    }

    const credentials = {
      email: this.authForm.value.email,
      password: this.authForm.value.password
    };

    try {
      const response = await this.http.post<LoginResponse>('https://maui-portal.vercel.app/api/login', credentials).toPromise();
      if (response && response.message === 'User found') {
        alert('Login successful');
        this.authService.setToken(response.token); // Save the token using AuthService
        this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        alert('Invalid Credentials');
      }
    } catch (error) {
      console.error('Request error:', error);
      alert('Server Error');
    }
  }

  onForgotPassword() {
    this.router.navigate(['/forgot']);
  }

  logout() {
    this.authService.clearToken(); // Clear token using AuthService
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
