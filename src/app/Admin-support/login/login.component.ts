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
import { ToastModule } from 'primeng/toast';

import { AuthService } from '../authentication/auth.service';
import { MessageService } from 'primeng/api';
import { NavigationsService } from '../../student-support/service/navigations.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, PasswordModule, ButtonModule, RippleModule, CheckboxModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
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
    private messageService: MessageService,
    private navigationsService: NavigationsService  // Inject the service
  ) {
    this.authForm = this.fb.group({
      email: ['bob.brown@example.com', [Validators.required, Validators.email]],
      password: ['password126', Validators.required],
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
      const response = await this.http.post<any>('http://localhost:3000/api/adminlogin', credentials).toPromise();

      if (response.status === 200) {
        const token = this.generateRandomToken();
        this.authService.setToken(token, credentials.rememberMe);
        sessionStorage.setItem('user', JSON.stringify(response.user)); // Store user data in sessionStorage
        localStorage.setItem('userId', response.user.id);

        this.messageService.add({severity:'success', summary:'Login Success', detail:'You have successfully logged in!'});

        // Retrieve the ID from localStorage for the admin roles API call
        const userId = localStorage.getItem('userId');
        if (userId) {
          const adminRolesBody = {
            Id: +userId, // Convert to number
            type: 'admin'
          };
          const adminRolesResponse = await this.http.post<any>('http://localhost:3000/api/adminroles', adminRolesBody).toPromise();
          console.log('Admin Roles Response:', adminRolesResponse);

          // Store the permissions in the NavigationsService
          const permissions = adminRolesResponse[0].roleDetails.permissions;
          this.navigationsService.setPermissions(permissions);

          // Store permissions in sessionStorage
          sessionStorage.setItem('permissions', JSON.stringify(permissions));

          setTimeout(() => {
            this.router.navigate(['/home'], { replaceUrl: true });
          }, 1000);
        }
      } else {
        this.messageService.add({severity:'error', summary:'Login Failed', detail:response.message});
      }
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

  private generateRandomToken(): string {
    return 'token-' + Math.random().toString(36).substr(2, 16);
  }
}
