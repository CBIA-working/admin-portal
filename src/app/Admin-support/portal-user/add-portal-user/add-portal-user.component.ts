import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
import { Service } from 'src/app/student-support/service/service';
import { PortalUser } from 'src/app/student-support/domain/schema';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-add-portal-user',
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
    ToastModule,
    InputTextModule,
    InputTextareaModule,
    MessageModule,
  ],
  providers: [MessageService, Service, DatePipe],
  templateUrl: './add-portal-user.component.html',
  styleUrl: './add-portal-user.component.scss'
})
export class AddPortalUserComponent implements OnInit {
  @Input() portalUser: PortalUser | null = null;
  @Output() dialogClose = new EventEmitter<PortalUser | null>();

  originalPortalUser: PortalUser | null = null;
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
  selectedFile: File | null = null;
  isAvatarSelected: boolean = false;
  fullName: string = '';

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.resetForm();
  }

  openDialog(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.portalUser = {
      id: 0,
      fname: '',
      lname: '',
      gender: '',
      dob: '',
      email: '',
      password: 'Pass@123',
      dietaryPreference: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
      emergencyContactRelation: '',
      address: '',
      imageUrl: 'assets/avatar/default.png' // Default avatar path
    };
    this.fullName = '';
    this.isAvatarSelected = false;
    this.selectedFile = null;
    this.showSaveButton = false;
    this.originalPortalUser = { ...this.portalUser };
  }

  onFullNameChange(): void {
    if (this.portalUser) {
      const [fname, ...lnameParts] = this.fullName.split(' ');
      this.portalUser.fname = fname;
      this.portalUser.lname = lnameParts.join(' ');
      this.checkForChanges();
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  openAvatarDialog(): void {
    this.showAvatarDialog = true;
  }

  selectAvatar(avatar: string): void {
    if (this.portalUser) {
      this.portalUser.imageUrl = avatar;
      this.selectedFile = null;
      this.isAvatarSelected = true;
      this.showAvatarDialog = false;
      this.checkForChanges();
    }
  }

  uploadImage(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        this.selectedFile = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (this.portalUser) {
            this.portalUser.imageUrl = reader.result as string;
            this.checkForChanges();
          }
        };
        reader.readAsDataURL(this.selectedFile);
      }
    });
    fileInput.click();
  }

  checkForChanges(): void {
    if (this.portalUser && this.originalPortalUser) {
      const studentCopy = { ...this.portalUser, imageUrl: this.selectedFile ? 'file-selected' : this.portalUser.imageUrl };
      this.showSaveButton = JSON.stringify(studentCopy) !== JSON.stringify(this.originalPortalUser);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.isAvatarSelected = false; // Unmark avatar as selected

      // Read the file and update imageUrl to display the selected file
      const reader = new FileReader();
      reader.onload = () => {
        if (this.portalUser) {
          this.portalUser.imageUrl = reader.result as string;
          this.checkForChanges();
          this.showAvatarDialog = false; // Close the dialog after selecting the file
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveChanges(): void {
    console.log('Save Changes button clicked'); // Debugging output

    if (!this.portalUser) {
      console.error('No student data to save');
      this.messageService.add({ severity: 'error', summary: 'Save Error', detail: 'No Portal User data to save.' });
      return;
    }
    
    if (!this.validateForm()) {
      console.error('Form validation failed', this.portalUser); // Debugging output
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill out all required fields.' });
      return;
    }

    console.log('Form is valid, proceeding to save', this.portalUser); // Debugging output

    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    const formData: FormData = new FormData();
    formData.append('id', this.portalUser.id.toString());
    formData.append('fname', this.portalUser.fname);
    formData.append('lname', this.portalUser.lname);
    formData.append('gender', this.portalUser.gender);
    formData.append('dob', this.portalUser.dob);
    formData.append('email', this.portalUser.email);
    formData.append('password', this.portalUser.password);
    formData.append('dietaryPreference', this.portalUser.dietaryPreference);
    formData.append('emergencyContactName', this.portalUser.emergencyContactName);
    formData.append('emergencyContactNumber', this.portalUser.emergencyContactNumber);
    formData.append('emergencyContactRelation', this.portalUser.emergencyContactRelation);
    formData.append('address', this.portalUser.address);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.isAvatarSelected) {
      this.urlToFile(this.portalUser.imageUrl, 'avatar.jpg', 'image/jpeg').then((file) => {
        formData.append('image', file);
        this.submitFormData(formData);  // Submit the form data
      });
      return;  // Return early to wait for the file conversion
    } else {
      formData.append('imageUrl', this.portalUser.imageUrl);
    }

    this.submitFormData(formData);
  }

  private urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    return fetch(url)
      .then(res => res.arrayBuffer())
      .then(buf => new File([buf], filename, { type: mimeType }));
  }

  private submitFormData(formData: FormData): void {
    console.log('Attempting to submit form data...', formData);  // Debugging output
    this.saveSubscription = this.service.addAdmin(formData)
      .subscribe(response => {
        console.log('Profile added successfully:', response);  // Debugging output
        this.messageService.add({ severity: 'success', summary: 'Add Success', detail: 'Profile added successfully.' });
        this.dialogClose.emit(this.portalUser);
        this.resetForm();
      }, error => {
        console.error('Error adding profile:', error);  // More detailed error logging
        this.messageService.add({ severity: 'error', summary: 'Add Error', detail: 'Error adding the profile.' });
      });
  }

  private validateForm(): boolean {
    if (!this.portalUser) return false;
    return !!this.portalUser.fname && !!this.portalUser.lname && !!this.portalUser.gender && !!this.portalUser.dob && !!this.portalUser.email;
  }

  onClose(): void {
    this.resetForm(); // Reset form when closing
    this.dialogClose.emit(null); // Emit close event
  }
}
