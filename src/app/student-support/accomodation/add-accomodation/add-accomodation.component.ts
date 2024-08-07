import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-add-accomodation',
  templateUrl: './add-accomodation.component.html',
  styleUrls: ['./add-accomodation.component.scss'],
  providers: [Service, MessageService, ConfirmationService],
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
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    MessageModule,
    DialogModule
  ]
})
export class AddAccomodationComponent implements OnInit {
  @Input() accomodation: Accomodation | null = null;
  @Output() dialogClose = new EventEmitter<Accomodation | null>();

  accomodationForm!: FormGroup;
  occupancyOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ];
  constructor(
    private fb: FormBuilder,
    private service: Service,
    private messageService: MessageService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.resetForm();
  }

  createForm(): void {
    this.accomodationForm = this.fb.group({
      roomNumber: ['', Validators.required],
      buildingName: ['', Validators.required],
      floor: ['', Validators.required],
      isSingleOccupancy: [false, Validators.required], // Ensure initialization here
      hostfamily: [{ value: '', disabled: true }],
      numberOfRoommates: [{ value: '', disabled: true }],
      roommates: this.fb.array([]),
    });
  
    // Listen to changes in isSingleOccupancy and update related fields
    this.accomodationForm.get('isSingleOccupancy')?.valueChanges.subscribe(isSingle => {
      this.updateRoommateValidation(isSingle);
    });
  }
  

  onSingleOccupancyChange(event: any): void {
    const isSingle = event.value;
    this.accomodationForm.get('isSingleOccupancy')?.setValue(isSingle, { emitEvent: false }); // Prevent circular event loops
    this.updateRoommateValidation(isSingle);
  }
  

  updateRoommateValidation(isSingle: boolean): void {
    if (isSingle) {
      this.accomodationForm.get('hostfamily')?.disable();
      this.accomodationForm.get('numberOfRoommates')?.disable();
      this.clearRoommates();
    } else {
      this.accomodationForm.get('hostfamily')?.enable();
      this.accomodationForm.get('numberOfRoommates')?.enable();
    }
    this.accomodationForm.get('hostfamily')?.updateValueAndValidity();
    this.accomodationForm.get('numberOfRoommates')?.updateValueAndValidity();
  }

  onRoommateCountChange(event: any): void {
    const count = event.target.value;
    this.updateRoommateFields(count);
  }

  updateRoommateFields(count: number): void {
    const roommates = this.accomodationForm.get('roommates') as FormArray;
    while (roommates.length !== 0) {
      roommates.removeAt(0);
    }
    for (let i = 0; i < count; i++) {
      roommates.push(this.fb.group({
        roommateName: ['', Validators.required],
        roommateNumber: ['', Validators.required],
      }));
    }
  }

  clearRoommates(): void {
    const roommates = this.accomodationForm.get('roommates') as FormArray;
    while (roommates.length !== 0) {
      roommates.removeAt(0);
    }
  }

  resetForm(): void {
    // Reset form to initial values
    this.accomodationForm.reset({
      roomNumber: '',
      buildingName: '',
      floor: '',
      isSingleOccupancy: true,  // Set to true explicitly
      hostfamily: '',
      numberOfRoommates: 0,  // Set default value
      roommates: []
    });
    this.accomodationForm.get('isSingleOccupancy')?.setValue(true);

  
    // Update roommate validation based on the initial single occupancy value
    this.updateRoommateValidation(true);
  
    // Mark all controls as untouched
    this.accomodationForm.markAsPristine();
    this.accomodationForm.markAsUntouched();
    this.accomodationForm.updateValueAndValidity();
  
    this.cd.detectChanges();
  }
  

  saveChanges(): void {
    console.log('Saving Changes:', this.accomodationForm.value);

    const formValue = { ...this.accomodationForm.getRawValue() };
    formValue.floor = formValue.floor.toString();

    // Ensure roommates is an empty array if single occupancy is true
    if (formValue.isSingleOccupancy) {
      formValue.hostfamily = ' ';
      formValue.numberOfRoommates = 0;
      formValue.roommates = [];  // Ensure roommates is an empty array
    }

    // Create the updated accommodation object
    const updatedAccomodation: Accomodation = {
      ...formValue,
      // Remove roommateNames and roommateNumbers if not needed
      // roommateNames,  
      // roommateNumbers  
    };

    if (this.accomodationForm.valid) {
      this.service.addAccomodation(updatedAccomodation).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Accommodation updated successfully.' });
          setTimeout(() => {
            this.dialogClose.emit(updatedAccomodation);
            this.resetForm();  // Reset the form after closing the dialog
          }, 1000); // Delay for 1 second before closing the dialog
        },
        error: (error) => {
          let errorMessage = 'Failed to update accommodation. Please try again later.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        }
      });
    } else {
      this.accomodationForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Form Error', detail: 'Please fill in all required fields correctly.' });
    }
  }

  onClose(): void {
    this.dialogClose.emit(null);
    this.resetForm();
  }
}
