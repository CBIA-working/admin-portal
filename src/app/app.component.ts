import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { Router,NavigationEnd } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { ActivityMonitorService } from './ActivityMonitorService';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,HomeComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router,private activityMonitorService: ActivityMonitorService) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.router.events.subscribe(() => {
      this.isAuthenticated = this.authService.isLoggedIn();
    });
  }

  title = 'angular-admin-portal';

}
