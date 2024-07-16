import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Service } from '../../service/service';
import { Accomodation } from '../../domain/schema';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-add-accomodation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
    CardModule,
    CalendarModule,
    ButtonModule,
    TabViewModule,
    FormsModule,
    HttpClientModule,
    ToastModule,
    DropdownModule
  ],
  templateUrl: './add-accomodation.component.html',
  styleUrls: ['./add-accomodation.component.scss'],
  providers: [MessageService]
})
export class AddAccomodationComponent implements OnInit {
  @Input() accomodation: Accomodation | null = null;
  @Output() dialogClose = new EventEmitter<Accomodation | null>();

  accomodationForm!: FormGroup;
  originalAccomodation: Accomodation | null = null;

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
      isSingleOccupancy: [false, Validators.required],
      numberOfRoommates: ['', Validators.required],
      roommateNames: ['', Validators.required],
      userId: ['', Validators.required]
    });
  }

  resetForm(): void {
    if (this.accomodation) {
      this.accomodationForm.patchValue({
        roomNumber: this.accomodation.roomNumber,
        buildingName: this.accomodation.buildingName,
        floor: this.accomodation.floor,
        isSingleOccupancy: this.accomodation.isSingleOccupancy,
        numberOfRoommates: this.accomodation.numberOfRoommates,
        roommateNames: this.accomodation.roommateNames,
        userId: this.accomodation.userId
      });
    } else {
      this.accomodationForm.reset({ isSingleOccupancy: false });
    }
    this.originalAccomodation = { ...this.accomodation };
  }

  saveChanges(): void {
    if (this.accomodationForm.valid) {
      const updatedAccomodation: Accomodation = {
        ...this.originalAccomodation,
        ...this.accomodationForm.value
      };

      this.service.addAccomodation(updatedAccomodation).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Accomodation added', detail: 'Accomodation has been successfully added.' });
          
          setTimeout(() => {
            this.dialogClose.emit(updatedAccomodation);
          }, 2000); // Adjust the delay time as needed (2000 ms = 2 seconds)
        },
        error: (error) => {
          console.error('Error adding accomodation:', error);

          let errorMessage = 'Failed to add accomodation. Please try again later.';
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
