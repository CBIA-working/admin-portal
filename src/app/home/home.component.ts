import { Component,OnInit } from '@angular/core';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  token: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    console.log('Token on Home Component:', this.token);
  }
}
