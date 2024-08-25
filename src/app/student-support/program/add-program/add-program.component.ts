import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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

import { Program } from '../../domain/schema';

@Component({
  selector: 'app-add-program',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CheckboxModule, CardModule, CalendarModule,
    ButtonModule, TabViewModule, FormsModule, HttpClientModule, ToastModule,
    DropdownModule, InputTextModule, InputTextareaModule, MessageModule, DialogModule
  ],
  providers: [MessageService],
  templateUrl: './add-program.component.html',
  styleUrl: './add-program.component.scss'
})
export class AddProgramComponent implements OnInit {
  @Input() program: Program | null = null;
  @Output() dialogClose = new EventEmitter<Program | null>();

  programForm!: FormGroup;
  originalProgram: Program | null = null;

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
    this.programForm = this.fb.group({
      name: ['', Validators.required],
      batch: ['', Validators.required],
    });
  }

  resetForm(): void {
    if (this.program) {
      this.programForm.patchValue({
        name: this.program.name,
        batch: this.program.batch,
      });
    } else {
      this.programForm.reset();
    }
    this.originalProgram = { ...this.program };
  }

  saveChanges(): void {
    if (this.programForm.valid) {
      const updatedProgram: Program = {
        ...this.originalProgram,
        ...this.programForm.value
      };

      this.service.addProgram(updatedProgram).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Program added', detail: 'Program has been successfully added.' });

          // Close the dialog after a delay
          setTimeout(() => {
            this.dialogClose.emit(updatedProgram);
          }, 2000); // Adjust the delay time as needed (2000 ms = 2 seconds)
        },
        error: (error) => {
          console.error('Error adding Program:', error);

          let errorMessage = 'Failed to add Program. Please try again later.';
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
      this.programForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.dialogClose.emit(null);
    this.resetForm(); // Correctly call the resetForm method
  }
}