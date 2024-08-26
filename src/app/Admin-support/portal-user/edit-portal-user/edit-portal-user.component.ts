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

@Component({
  selector: 'app-edit-portal-user',
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
  providers: [MessageService, Service, DatePipe],
  templateUrl: './edit-portal-user.component.html',
  styleUrl: './edit-portal-user.component.scss'
})
export class EditPortalUserComponent implements OnInit {
  @Input() portalUser: PortalUser | null = null;
  @Output() dialogClose: EventEmitter<PortalUser | null> = new EventEmitter<PortalUser | null>();

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
  selectedFile: File | null = null; // Store the selected file
  isAvatarSelected: boolean = false; // Track if a predefined avatar is selected
  fullName: string = '';

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe  // Inject DatePipe
  ) { }

  ngOnInit(): void {
    if (this.portalUser) {
      this.originalPortalUser = { ...this.portalUser };

      // Format the date of birth
      this.portalUser.dob = this.datePipe.transform(this.portalUser.dob, 'yyyy-MM-dd');
      this.originalPortalUser.dob = this.datePipe.transform(this.originalPortalUser.dob, 'yyyy-MM-dd');

      // Set full name
      this.fullName = `${this.portalUser.fname} ${this.portalUser.lname}`;
    }
  }

  onFullNameChange(): void {
    if (this.portalUser) {
      const [fname, ...lnameParts] = this.fullName.split(' ');
      this.portalUser.fname = fname;
      this.portalUser.lname = lnameParts.join(' '); // Join the rest of the name if there are spaces
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
      this.selectedFile = null; // Clear any selected file
      this.isAvatarSelected = true; // Mark avatar as selected
      this.showAvatarDialog = false;
      this.checkForChanges();
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

  checkForChanges(): void {
    if (this.portalUser && this.originalPortalUser) {
      const studentCopy = { ...this.portalUser, imageUrl: this.selectedFile ? 'file-selected' : this.portalUser.imageUrl };
      this.showSaveButton = JSON.stringify(studentCopy) !== JSON.stringify(this.originalPortalUser);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.portalUser) {
      const formData: FormData = new FormData();
      formData.append('id', this.portalUser.id.toString());
      formData.append('fname', this.portalUser.fname);
      formData.append('lname', this.portalUser.lname);
      formData.append('gender', this.portalUser.gender);
      formData.append('dob', this.portalUser.dob);
      formData.append('email', this.portalUser.email);
      formData.append('dietaryPreference', this.portalUser.dietaryPreference);
      formData.append('emergencyContactName', this.portalUser.emergencyContactName);
      formData.append('emergencyContactNumber', this.portalUser.emergencyContactNumber);
      formData.append('emergencyContactRelation', this.portalUser.emergencyContactRelation);
      formData.append('address', this.portalUser.address);

      // Append the image file if it's selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      } else if (this.isAvatarSelected) {
        // Convert predefined avatar URL to a File object
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
  }

  private urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    return fetch(url)
      .then(res => res.arrayBuffer())
      .then(buf => new File([buf], filename, { type: mimeType }));
  }

  private submitFormData(formData: FormData): void {
    this.saveSubscription = this.service.getupdateAdmin(formData)
      .subscribe(response => {
        console.log('Profile updated successfully:', response);
        this.messageService.add({ severity: 'success', summary: 'Profile Updated', detail: 'Will reload to apply the changes.' });
        setTimeout(() => {
          this.dialogClose.emit(this.portalUser); // Emit the updated student object
        }, 1000);
      }, error => {
        console.error('Error updating profile:', error);
      });
  }
  closeDialog(): void {
    this.dialogClose.emit(null);
  }
}