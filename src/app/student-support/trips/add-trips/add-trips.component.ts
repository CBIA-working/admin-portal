import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from '../../service/service';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { Trip } from '../../domain/schema';

@Component({
  selector: 'app-add-trips',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CheckboxModule, 
    CardModule, CalendarModule,
    ButtonModule, TabViewModule, FormsModule, HttpClientModule, 
    ToastModule,
    DropdownModule, InputTextModule, InputTextareaModule, 
    MessageModule, DialogModule
  ],
  providers: [MessageService],
  templateUrl: './add-trips.component.html',
  styleUrl: './add-trips.component.scss'
})
export class AddTripsComponent implements OnInit {
  @Input() trip: Trip | null = null;
  @Output() dialogClose = new EventEmitter<Trip | null>();

  tripForm!: FormGroup;
  originalTrip: Trip | null = null;
  goingFormFilledOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
];
  constructor(
    private fb: FormBuilder,
    private service: Service,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.resetForm();
  }

  createForm(): void {
    this.tripForm = this.fb.group({
      TripName: ['', Validators.required],
      Location: ['', Validators.required],
      DepartureDate: ['', Validators.required],
      ReturnDate: ['', Validators.required],
      FullName: ['', Validators.required],
      StudentId: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      Purpose: ['', Validators.required],
      GoingFormFilled: [false, Validators.required]
    });
  }
  

  resetForm(): void {
    if (this.trip) {
      this.tripForm.patchValue({
        TripName: this.trip.TripName,
        Location: this.trip.Location,
        DepartureDate: this.trip.DepartureDate,
        ReturnDate: this.trip.ReturnDate,
        FullName: this.trip.FullName,
        StudentId: this.trip.StudentId,
        PhoneNumber: this.trip.PhoneNumber,
        Purpose: this.trip.Purpose,
        GoingFormFilled: this.trip.GoingFormFilled,
      });
    } else {
      this.tripForm.reset({ GoingFormFilled: false });
    }
    this.originalTrip = { ...this.trip };
  }

  saveChanges(): void {
    if (this.tripForm.valid) {
      const updatedTrip: Trip = {
        ...this.originalTrip,
        ...this.tripForm.value
      };
  
      this.service.addTrip(updatedTrip).subscribe({
        next: (response) => {
          console.log('Trip added successfully:', response);
          this.messageService.add({ severity: 'success', summary: 'Trip added', detail: 'Trip has been successfully added.' });
  
          // Close the dialog after a delay
          setTimeout(() => {
            this.dialogClose.emit(updatedTrip);
          }, 2000);
        },
        error: (error) => {
          console.error('Error adding trip:', error);
  
          let errorMessage = 'Failed to add trip. Please try again later.';
          if (error.error) {
            if (error.error.message) {
              errorMessage = error.error.message;
            } else if (error.error.errors) {
              errorMessage = 'Validation errors occurred: ' + Object.values(error.error.errors).join(', ');
            }
          } else if (error.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          }
  
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        }
      });
    } else {
      console.log('Form is invalid');
      this.tripForm.markAllAsTouched();
    }
  }
  

  onClose(): void {
    this.dialogClose.emit(null);
    this.resetForm(); // Correctly call the resetForm method
  }
}
