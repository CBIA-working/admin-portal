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
import { Service } from '../../service/service';
import { Student } from '../../domain/schema';

@Component({
  selector: 'app-edit-students',
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
  templateUrl: './edit-students.component.html',
  styleUrls: ['./edit-students.component.scss'],
  providers: [MessageService, Service, DatePipe] // Add DatePipe to providers
})
export class EditStudentsComponent implements OnInit {
  @Input() student: Student | null = null;
  @Output() dialogClose: EventEmitter<Student> = new EventEmitter<Student>();

  originalStudent: Student | null = null;
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
    if (this.student) {
      this.originalStudent = { ...this.student };

      // Format the date of birth
      this.student.dob = this.datePipe.transform(this.student.dob, 'yyyy-MM-dd');
      this.originalStudent.dob = this.datePipe.transform(this.originalStudent.dob, 'yyyy-MM-dd');
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  openAvatarDialog(): void {
    this.showAvatarDialog = true;
  }

  selectAvatar(avatar: string): void {
    if (this.student) {
      this.student.imageUrl = avatar;
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
        if (this.student) {
          this.student.imageUrl = reader.result as string;
          this.checkForChanges();
          this.showAvatarDialog = false; // Close the dialog after selecting the file
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  checkForChanges(): void {
    if (this.student && this.originalStudent) {
      const studentCopy = { ...this.student, imageUrl: this.selectedFile ? 'file-selected' : this.student.imageUrl };
      this.showSaveButton = JSON.stringify(studentCopy) !== JSON.stringify(this.originalStudent);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.student) {
      const formData: FormData = new FormData();
      formData.append('id', this.student.id.toString());
      formData.append('fname', this.student.fname);
      formData.append('lname', this.student.lname);
      formData.append('gender', this.student.gender);
      formData.append('dob', this.student.dob);
      formData.append('email', this.student.email);
      formData.append('dietaryPreference', this.student.dietaryPreference);
      formData.append('emergencyContactName', this.student.emergencyContactName);
      formData.append('emergencyContactNumber', this.student.emergencyContactNumber);
      formData.append('emergencyContactRelation', this.student.emergencyContactRelation);
      formData.append('address', this.student.address);

      // Append the image file if it's selected
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      } else if (this.isAvatarSelected) {
        // Convert predefined avatar URL to a File object
        this.urlToFile(this.student.imageUrl, 'avatar.jpg', 'image/jpeg').then((file) => {
          formData.append('image', file);
          this.submitFormData(formData);  // Submit the form data
        });
        return;  // Return early to wait for the file conversion
      } else {
        formData.append('imageUrl', this.student.imageUrl);
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
    this.saveSubscription = this.service.getupdateStudent(formData)
      .subscribe(response => {
        console.log('Profile updated successfully:', response);
        this.messageService.add({ severity: 'success', summary: 'Profile Updated', detail: 'Will reload to apply the changes.' });
        setTimeout(() => {
          this.dialogClose.emit(this.student); // Emit the updated student object
        }, 1000);
      }, error => {
        console.error('Error updating profile:', error);
      });
  }
}