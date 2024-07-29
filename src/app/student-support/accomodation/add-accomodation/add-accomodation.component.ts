import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-add-accomodation',
  templateUrl: './add-accomodation.component.html',
  styleUrls: ['./add-accomodation.component.scss'],
  providers: [MessageService],
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
    DialogModule  // Include this only if you are using dialogs
  ]
})
export class AddAccomodationComponent implements OnInit {
  @Input() accomodation: Accomodation | null = null;
  @Output() dialogClose = new EventEmitter<Accomodation | null>();

  accomodationForm!: FormGroup;

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
      isSingleOccupancy: [false, Validators.required],
      hostfamily: [{ value: '', disabled: true }],
      numberOfRoommates: [{ value: '', disabled: true }],
      roommates: this.fb.array([]),
    });
  }

  onSingleOccupancyChange(event: any): void {
    console.log('Dropdown Change Event:', event);
    const isSingle = event.value;
    this.accomodationForm.get('isSingleOccupancy').setValue(isSingle, { emitEvent: false }); // Prevent circular event loops
    this.updateRoommateValidation(isSingle);
  }

  updateRoommateValidation(isSingle: boolean): void {
    console.log('Updating Roommate Validation, isSingle:', isSingle);
    if (isSingle) {
      this.accomodationForm.get('hostfamily').disable();
      this.accomodationForm.get('numberOfRoommates').disable();
      this.clearRoommates();
    } else {
      this.accomodationForm.get('hostfamily').enable();
      this.accomodationForm.get('numberOfRoommates').enable();
    }
    this.accomodationForm.get('hostfamily').updateValueAndValidity();
    this.accomodationForm.get('numberOfRoommates').updateValueAndValidity();
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
    // Manually set the values to ensure UI updates
    this.accomodationForm.setValue({
      roomNumber: '',
      buildingName: '',
      floor: '',
      isSingleOccupancy: false,  // Set to false explicitly
      hostfamily: '',
      numberOfRoommates: '',
      roommates: []
    });
  
    // Trigger validation updates for dependent controls
    this.updateRoommateValidation(false);
    this.cd.detectChanges(); 
  }
  
  saveChanges(): void {
    console.log('Saving Changes:', this.accomodationForm.value);
  
    const formValue = { ...this.accomodationForm.getRawValue() };
  
    if (formValue.isSingleOccupancy) {
      formValue.hostfamily = ' ';
      formValue.numberOfRoommates = 0;
      formValue.roommates = [];
    }
  
    if (this.accomodationForm.valid) {
      const updatedAccomodation: Accomodation = {
        ...formValue,
        roommateNames: formValue.roommates.map((roommate: any) => `${roommate.roommateName}`).join(', '),
        roommateNumbers: formValue.roommates.map((roommate: any) => `${roommate.roommateNumber}`).join(', ')
      };
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
