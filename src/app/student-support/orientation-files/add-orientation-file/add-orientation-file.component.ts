import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrientationFile } from '../../domain/schema';
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

import { Courses } from '../../domain/schema';
@Component({
  selector: 'app-add-orientation-file',
  standalone:true,
  imports: [
    CommonModule, ReactiveFormsModule, CheckboxModule, CardModule, CalendarModule,
    ButtonModule, TabViewModule, FormsModule, HttpClientModule, ToastModule,
    DropdownModule, InputTextModule, InputTextareaModule, MessageModule, DialogModule
  ],
  providers: [MessageService],
  templateUrl: './add-orientation-file.component.html',
  styleUrl: './add-orientation-file.component.scss'
})
export class AddOrientationFileComponent  implements OnInit {
    @Input()  OrientationFile : OrientationFile | null = null;
    @Output() dialogClose = new EventEmitter<OrientationFile | null>();
  
    orientationFileForm!: FormGroup;
    originalOrientationFile: OrientationFile | null = null;
  
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
      this.orientationFileForm = this.fb.group({
        Name: ['', Validators.required],
        Description: ['', Validators.required],
        OrientationPdf: ['', Validators.required],
      });
    }
  
    resetForm(): void {
      if (this.OrientationFile) {
        this.orientationFileForm.patchValue({
          Name: this.OrientationFile.Name,
          Description: this.OrientationFile.Description,
          OrientationPdf: this.OrientationFile.OrientationPdf,
        });
      } else {
        this.orientationFileForm.reset();
      }
      this.originalOrientationFile = { ...this.OrientationFile };
    }
  
    saveChanges(): void {
      if (this.orientationFileForm.valid) {
        const updatedOrientationFile: OrientationFile = {
          ...this.originalOrientationFile,
          ...this.orientationFileForm.value
        };
  
        this.service.addOrientation(updatedOrientationFile).subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'success', summary: 'Orientation File added', detail: 'Orientation File has been successfully added.' });
  
            // Close the dialog after a delay
            setTimeout(() => {
              this.dialogClose.emit(updatedOrientationFile);
            }, 2000); // Adjust the delay time as needed (2000 ms = 2 seconds)
          },
          error: (error) => {
            console.error('Error adding Orientation File:', error);
  
            let errorMessage = 'Failed to add Orientation File. Please try again later.';
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
        this.orientationFileForm.markAllAsTouched();
      }
    }
  
    onClose(): void {
      this.dialogClose.emit(null);
      this.resetForm(); // Correctly call the resetForm method
    }
  }
  
