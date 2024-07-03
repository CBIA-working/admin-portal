import { Component,OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  token: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Retrieve the token from AuthService
    this.token = this.authService.getToken();
    console.log('Token in HomeComponent:', this.token); // For debugging
  }
}

