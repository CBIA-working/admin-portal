import { Component, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImportsModule } from 'src/app/imports';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [
    StepperModule,
    ButtonModule,
    InputTextModule,
    ToggleButtonModule,
    IconFieldModule,
    InputIconModule,
    CommonModule,
    ImportsModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService, MessageService],
  styles: [
    `.p-stepper {
      flex-basis: 40rem;
    }`
  ],
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent {
  displayDialog: boolean = false; // Add this line to control dialog visibility

  active = 0;
  fname: string | undefined;
  lname: string | undefined;
  email: string | undefined;
  password: string | undefined;
  dob: string | undefined;
  address: string | undefined;
  selectedGender: string | undefined;
  bloodGroup: string | undefined;
  dietaryPreference: string | undefined;
  emergencyContactName: string | undefined;
  emergencyContactNumber: string | undefined;
  emergencyContactRelation: string | undefined;

  genders: any[] = [
    { label: 'Male', icon: 'pi pi-fw pi-mars', value: 'Male' },
    { label: 'Female', icon: 'pi pi-fw pi-venus', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router // Inject Router
  ) {}

  submitForm() {
    const formData = {
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      password: this.password,
      dob: this.dob,
      address: this.address,
      gender: this.selectedGender, // Use the dynamically selected gender
      bloodGroup: this.bloodGroup,
      dietaryPreference: this.dietaryPreference,
      emergencyContactName: this.emergencyContactName,
      emergencyContactNumber: this.emergencyContactNumber,
      emergencyContactRelation: this.emergencyContactRelation
    };

    console.log('Submitting form with data:', formData);

    this.http.post('https://maui-portal.vercel.app/api/register', formData)
      .subscribe(
        (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message, life: 3000 });
          this.resetForm(); // Reset form only on success
          this.router.navigate(['/managestudent']); // Navigate away on success
          this.closeDialog(); // Close the dialog on success
        },
        (error) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to submit data', life: 3000 });
          console.error('Error:', error);
        }
      );
  }

  resetForm() {
    this.active = 0; // Reset stepper to first step
    this.fname = undefined;
    this.lname = undefined;
    this.email = undefined;
    this.password = undefined;
    this.dob = undefined;
    this.address = undefined;
    this.selectedGender = undefined;
    this.bloodGroup = undefined;
    this.dietaryPreference = undefined;
    this.emergencyContactName = undefined;
    this.emergencyContactNumber = undefined;
    this.emergencyContactRelation = undefined;
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Are you sure?',
      message: 'Please confirm to proceed.',
      accept: () => {
        this.submitForm();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

closeDialog() {
  this.confirmationService.close();
  }
}
