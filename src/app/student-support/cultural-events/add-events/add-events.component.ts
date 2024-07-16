import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CulturalEvent } from '../../domain/schema';
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
  selector: 'app-add-events',
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
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss'],
  providers:[MessageService]
})
export class AddEventsComponent implements OnInit {
  @Input() event: CulturalEvent | null = null;
  @Output() dialogClose = new EventEmitter<CulturalEvent | null>();

  eventForm!: FormGroup;
  originalEvent: CulturalEvent | null = null;
  signedUpOptions = [
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
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required],
      signedUp: [false, Validators.required]  // Include signedUp field with default value and validation
    });
  }

  resetForm(): void {
    if (this.event) {
      this.eventForm.patchValue({
        eventName: this.event.eventName,
        date: this.event.date,
        description: this.event.description,
        signedUp: this.event.signedUp // Ensure signedUp field is populated
      });
    } else {
      this.eventForm.reset({ signedUp: false }); // Default value for signedUp
    }
    this.originalEvent = { ...this.event };
  }

  saveChanges(): void {
    if (this.eventForm.valid) {
      const updatedEvent: CulturalEvent = {
        ...this.originalEvent,
        ...this.eventForm.value
      };

      this.service.addEvent(updatedEvent).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Event added', detail: 'Event has been successfully added.' });
          this.dialogClose.emit(updatedEvent);
        },
        error: (error) => {
          console.error('Error adding event:', error);

          let errorMessage = 'Failed to add event. Please try again later.';
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
      this.eventForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.dialogClose.emit(null);
  }
}
