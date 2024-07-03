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
      email: ['', [Validators.required, Validators.email]], // Email validation
      password: ['', Validators.required] // Password validation
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
      // Display form errors
      this.loginHasError = this.authForm.controls['email'].invalid;
      this.passwordHasError = this.authForm.controls['password'].invalid;
      alert('Please fill in all required fields.'); // Show alert for form errors
      return;
    }

    const credentials = {
      email: this.authForm.value.email,
      password: this.authForm.value.password
    };

    // Use a mock token for testing
    const mockToken = 'mock-token-' + Math.random().toString(36).substr(2, 9); // Generate a random token

    try {
      // Simulate a successful login response
      const response: LoginResponse = {
        message: 'User found',
        token: mockToken
      };

      console.log('Login response:', response); // For debugging
      this.authService.setToken(response.token); // Save the token using AuthService
      alert('Login successful!'); // Show success alert
      this.router.navigate(['/home'], { replaceUrl: true }); // Navigate to home
    } catch (error) {
      console.error('Request error:', error); // For debugging
      alert('Server Error'); // Show error alert
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
