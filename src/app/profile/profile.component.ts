import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Service } from '../student-support/service/service';

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
  providers: [MessageService, Service, DatePipe]  // Add DatePipe to providers
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
  avatars: string[] = [
    'assets/avatar/1.jpg',
    'assets/avatar/2.jpg',
    'assets/avatar/3.jpg',
    'assets/avatar/4.jpg',
    'assets/avatar/5.jpg',
    'assets/avatar/6.jpg',
    'assets/avatar/7.jpg',
    'assets/avatar/8.jpg',
    'assets/avatar/9.jpg'
  ];
  selectedFile: File | null = null; // Store the selected file
  isAvatarSelected: boolean = false; // Track if a predefined avatar is selected

  constructor(
    private service: Service, 
    private messageService: MessageService, 
    private datePipe: DatePipe  // Inject DatePipe
  ) { }

  ngOnInit(): void {
    const userData = JSON.parse(sessionStorage.getItem('user')!);
    if (userData) {
      this.user = { ...userData };
      this.originalUser = { ...userData };
      this.user.fullName = `${userData.fname} ${userData.lname}`;

      // Format the date of birth
      this.user.dob = this.datePipe.transform(this.user.dob, 'yyyy-MM-dd');
      this.originalUser.dob = this.datePipe.transform(this.originalUser.dob, 'yyyy-MM-dd');
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
    this.selectedFile = null; // Clear any selected file
    this.isAvatarSelected = true; // Mark avatar as selected
    this.showAvatarDialog = false;
    this.checkForChanges();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.isAvatarSelected = false; // Unmark avatar as selected

      // Read the file and update imageUrl to display the selected file
      const reader = new FileReader();
      reader.onload = () => {
        this.user.imageUrl = reader.result as string;
        this.checkForChanges();
        this.showAvatarDialog = false; // Close the dialog after selecting the file
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  checkForChanges(): void {
    const userCopy = { ...this.user, imageUrl: this.selectedFile ? 'file-selected' : this.user.imageUrl };
    this.showSaveButton = JSON.stringify(userCopy) !== JSON.stringify(this.originalUser);
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    const userId = JSON.parse(sessionStorage.getItem('user')!).id;

    const formData: FormData = new FormData();
    formData.append('id', userId.toString());
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

    // Append the image file if it's selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.isAvatarSelected) {
      // Convert predefined avatar URL to a File object
      this.urlToFile(this.user.imageUrl, 'avatar.jpg', 'image/jpeg').then((file) => {
        formData.append('image', file);
        this.submitFormData(formData);  // Submit the form data
      });
      return;  // Return early to wait for the file conversion
    } else {
      formData.append('imageUrl', this.user.imageUrl);
    }

    this.submitFormData(formData);
  }

  private urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    return fetch(url)
      .then(res => res.arrayBuffer())
      .then(buf => new File([buf], filename, { type: mimeType }));
  }

  private submitFormData(formData: FormData): void {
    this.saveSubscription = this.service.getupdateProfile(formData)
      .subscribe(response => {
        console.log('Profile updated successfully:', response);
        sessionStorage.setItem('user', JSON.stringify(this.user));
        this.messageService.add({ severity: 'success', summary: 'Profile Updated', detail: 'Will reload to apply the changes.' });
        setTimeout(() => {
          location.reload();
        }, 1000);
      }, error => {
        console.error('Error updating profile:', error);
      });
  }
}
