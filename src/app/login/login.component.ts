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
import { ToastModule,  } from 'primeng/toast'; 

import { AuthService } from '../authentication/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, PasswordModule, ButtonModule, RippleModule, CheckboxModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]  // Add MessageService to providers
})
export class LoginComponent implements OnInit {
  authForm: FormGroup;
  loginHasError: boolean = false;
  passwordHasError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService  // Inject MessageService
  ) {
    this.authForm = this.fb.group({
      email: ['knanda3001@gmail.com', [Validators.required, Validators.email]],
      password: ['Pass@12', Validators.required],
      rememberme: [false]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.clearToken();
    }
  }

  async onLogin() {
    if (this.authForm.invalid) {
      this.messageService.add({severity:'error', summary:'Error', detail:'Please fill in all required fields.'});
      return;
    }
  
    const credentials = {
      email: this.authForm.value.email,
      password: this.authForm.value.password,
      rememberMe: this.authForm.value.rememberme
    };
  
    try {
      const mockToken = 'mock-token-' + Math.random().toString(36).substr(2, 9);
      const response = {
        message: 'User found',
        token: mockToken
      };
  
      this.authService.setToken(response.token, credentials.rememberMe);
      this.messageService.add({severity:'success', summary:'Login Success', detail:'You have successfully logged in!'});
  
      // Delaying navigation only slightly, or not at all if the toast duration is longer
      setTimeout(() => {
        this.router.navigate(['/home'], { replaceUrl: true });
      }, 1000);  // Short delay to start navigation after toast appears
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Server Error', detail:'Could not process login.'});
    }
  }
  
  
  

  onForgotPassword() {
    this.router.navigate(['/forgot']);
  }

  logout() {
    this.authService.clearToken();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
