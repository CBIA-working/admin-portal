import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CardModule,
    AvatarModule,
    ButtonModule,
    TabViewModule,
    FormsModule,
    DialogModule,
    HttpClientModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {
    fname: '',
    lname: '',
    gender: '',
    dob: '',
    email: '',
    dietaryPreference: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    emergencyContactRelation: '',
    address: '',
    imageUrl: 'assets/avatar/1.jpg', // Default avatar
    fullName: ''
  };
  originalUser: any;
  showAvatarDialog: boolean = false;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem('user')!);
    if (userData) {
      this.user = { ...userData };
      this.originalUser = { ...userData };
      this.user.fullName = `${userData.fname} ${userData.lname}`;
    }
  }

  updateFullName(): void {
    const names = this.user.fullName.split(' ');
    this.user.fname = names[0] || '';
    this.user.lname = names.slice(1).join(' ') || '';
    this.checkForChanges();
  }

  openAvatarDialog(): void {
    this.showAvatarDialog = true;
  }

  selectAvatar(avatar: string): void {
    this.user.imageUrl = avatar;
    this.showAvatarDialog = false;
    this.checkForChanges();
  }

  checkForChanges(): void {
    this.showSaveButton = JSON.stringify(this.user) !== JSON.stringify(this.originalUser);
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
    const payload = { ...this.user, image: this.user.imageUrl };
    delete payload.imageUrl;

    this.saveSubscription = this.http.post('http://localhost:3000/api/updateProfile', payload)
      .subscribe(response => {
        console.log('Profile updated successfully:', response);
        this.originalUser = { ...this.user };
        this.showSaveButton = false;
      }, error => {
        console.error('Error updating profile:', error);
      });
  }
}
