import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from 'src/app/student-support/service/service';
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

import { Faq } from 'src/app/student-support/domain/schema';

@Component({
  selector: 'app-add-faq',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CheckboxModule, CardModule, CalendarModule,
    ButtonModule, TabViewModule, FormsModule, HttpClientModule, ToastModule,
    DropdownModule, InputTextModule, InputTextareaModule, MessageModule, DialogModule
  ],
  providers: [MessageService],
  templateUrl: './add-faq.component.html',
  styleUrl: './add-faq.component.scss'
})
export class AddFaqComponent implements OnInit {
  @Input() faq: Faq | null = null;
  @Output() dialogClose = new EventEmitter<Faq | null>();

  faqForm!: FormGroup;
  originalFaq: Faq | null = null;

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
    this.faqForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  resetForm(): void {
    if (this.faq) {
      this.faqForm.patchValue({
        name: this.faq.name,
        batch: this.faq.description,
      });
    } else {
      this.faqForm.reset();
    }
    this.originalFaq = { ...this.faq };
  }

  saveChanges(): void {
    if (this.faqForm.valid) {
      const updatedFaq: Faq = {
        ...this.originalFaq,
        ...this.faqForm.value
      };

      this.service.addFaq(updatedFaq).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Faq added', detail: 'Faq has been successfully added.' });

          // Close the dialog after a delay
          setTimeout(() => {
            this.dialogClose.emit(updatedFaq);
          }, 2000); // Adjust the delay time as needed (2000 ms = 2 seconds)
        },
        error: (error) => {
          console.error('Error adding Faq:', error);

          let errorMessage = 'Failed to add Faq. Please try again later.';
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
      this.faqForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.dialogClose.emit(null);
    this.resetForm(); // Correctly call the resetForm method
  }
}