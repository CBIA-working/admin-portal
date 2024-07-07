import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CardModule,
    AvatarModule,
    ButtonModule,
    TabViewModule, // Import TabViewModule here
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
  }
// Function to determine the avatar URL based on gender
getAvatarUrl(gender: string): string {
  switch (gender.toLowerCase()) {
    case 'male':
      return 'assets/avatar/male.jpg';
    case 'female':
      return 'assets/avatar/female.jpg';
    default:
      return 'assets/avatar/other.jpg';
  }
}
}
