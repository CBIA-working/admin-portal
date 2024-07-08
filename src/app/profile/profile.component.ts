import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    HttpClientModule,
    CommonModule,
    ToastModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MessageService]  // Add MessageService to providers
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
    imageUrl: '', // Default avatar
    fullName: ''
  };
  originalUser: any;
  showAvatarDialog: boolean = false;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;

  constructor(private http: HttpClient, private messageService: MessageService) { }

  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem('user')!);
    if (userData) {
      this.user = { ...userData };
      this.originalUser = { ...userData };
      this.user.fullName = `${userData.fname} ${userData.lname}`;
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
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
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        this.user.imageUrl = reader.result as string;
        this.checkForChanges();
        this.showAvatarDialog = false; // Close the dialog after selecting the file
      };

      reader.readAsDataURL(file); // Convert image file to base64 URL
    }
  }
  checkForChanges(): void {
    this.showSaveButton = JSON.stringify(this.user) !== JSON.stringify(this.originalUser);
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    const userId = JSON.parse(sessionStorage.getItem('user')!).id;

    const formData: FormData = new FormData();
    formData.append('id', userId);
    formData.append('fname', this.user.fname);
    formData.append('lname', this.user.lname);
    formData.append('gender', this.user.gender);
    formData.append('dob', this.user.dob);
    formData.append('email', this.user.email);
    formData.append('dietaryPreference', this.user.dietaryPreference);
    formData.append('emergencyContactName', this.user.emergencyContactName);
    formData.append('emergencyContactNumber', this.user.emergencyContactNumber);
    formData.append('emergencyContactRelation', this.user.emergencyContactRelation);
    formData.append('address', this.user.address);
    
    // Only append image if it's not the default avatar
    if (this.user.imageUrl !== 'assets/avatar/1.jpg') {
      formData.append('imageUrl', this.user.imageUrl);
    }

    this.saveSubscription = this.http.post('http://localhost:3000/api/updateProfile', formData)
      .subscribe(response => {
        console.log('Profile updated successfully:', response);

        // Update session storage with the new user data
        sessionStorage.setItem('user', JSON.stringify(this.user));
        
        // Show success toast message
        this.messageService.add({ severity: 'success', summary: 'Profile Updated', detail: 'Will relod to apply the changes.' });
        
        // Reload the page after a short delay to ensure the toast message is visible
        setTimeout(() => {
          location.reload();
        }, 1000);
      }, error => {
        console.error('Error updating profile:', error);
      });
  }
}
