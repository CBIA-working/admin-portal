import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Accomodation} from '../../domain/schema';
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

@Component({
  selector: 'app-add-accomodation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckboxModule, CardModule,CalendarModule,
    ButtonModule,
    TabViewModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    ToastModule,
    DropdownModule
  ],
  templateUrl: './add-accomodation.component.html',
  styleUrl: './add-accomodation.component.scss',
  providers:[MessageService]
})
export class AddAccomodationComponent implements OnInit {
  @Input() accomodation: Accomodation | null = null;
  @Output() dialogClose = new EventEmitter<Accomodation | null>();
  accomodationForm!: FormGroup;
  originalaccomodation: Accomodation | null = null;
  isSingleOccupancyOptions = [
    { label: 'No', value: false },
    { label: 'Yes', value: true }
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
    this.accomodationForm = this.fb.group({
      roomNumber: ['', Validators.required],
      buildingName: ['', Validators.required],
      floor: ['', Validators.required],
      isSingleOccupancy: [false, Validators.required],  // Include signedUp field with default value and validation
      numberOfRoommates: ['', Validators.required],
      roommateNames: ['', Validators.required],
    });
  }
  resetForm(): void {
    if (this.accomodation) {
      this.accomodationForm.patchValue({
        roomNumber: this.accomodation.roomNumber,
        buildingName: this.accomodation.buildingName,
        floor: this.accomodation.floor,
        isSingleOccupancy: this.accomodation.isSingleOccupancy, // Ensure signedUp field is populated
        numberOfRoommates: this.accomodation.buildingName,
        roommateNames: this.accomodation.floor,
      });
    } else {
      this.accomodationForm.reset({ signedUp: false }); // Default value for signedUp
    }
    this.originalaccomodation = { ...this.accomodation };
  }

saveChanges(): void {
  if (this.accomodationForm.valid) {
    const updatedAccomodation: Accomodation = {
      ...this.originalaccomodation,
      ...this.accomodationForm.value
    };

    this.service.addAccomodation(updatedAccomodation).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Accomodation added', detail: 'Accomodation has been successfully added.' });
        this.dialogClose.emit(updatedAccomodation);
      },
      error: (error) => {
        console.error('Error adding Accomodation:', error);

        let errorMessage = 'Failed to add Accomodation. Please try again later.';
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
    this.accomodationForm.markAllAsTouched();
  }
}

onClose(): void {
  this.dialogClose.emit(null);
}
}