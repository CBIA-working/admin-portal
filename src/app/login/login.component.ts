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
import { ToastModule } from 'primeng/toast'; // Import ToastModule if needed
import { AuthService } from '../authentication/auth.service';
// Import MessageService if needed, but we will use alert for simplicity

interface LoginResponse {
  message: string;
  token: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, PasswordModule, ButtonModule, RippleModule, CheckboxModule, ToastModule], // Add ToastModule if needed
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  // Remove MessageService from providers
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;
  loginHasError: boolean = false;
  passwordHasError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // Remove MessageService if not needed
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberme: [false]  // Default value set to false
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
      alert('Please fill in all required fields.');
      return;
    }
  
    const credentials = {
      email: this.authForm.value.email,
      password: this.authForm.value.password,
      rememberMe: this.authForm.value.rememberme // Ensuring the correct value is passed
    };
  
    const mockToken = 'mock-token-' + Math.random().toString(36).substr(2, 9);
  
    try {
      const response: LoginResponse = {
        message: 'User found',
        token: mockToken
      };
  
      this.authService.setToken(response.token, credentials.rememberMe); // Pass the checkbox value
      alert('Login successful!');
      this.router.navigate(['/home'], { replaceUrl: true });
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
