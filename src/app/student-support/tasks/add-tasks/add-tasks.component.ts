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
import { Tasks, Trip } from '../../domain/schema';
@Component({
  selector: 'app-add-tasks',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CheckboxModule, 
    CardModule, CalendarModule,
    ButtonModule, TabViewModule, FormsModule, HttpClientModule, 
    ToastModule,
    DropdownModule, InputTextModule, InputTextareaModule, 
    MessageModule, DialogModule
  ],
  providers: [MessageService,Service],
  templateUrl: './add-tasks.component.html',
  styleUrl: './add-tasks.component.scss'
})
export class AddTasksComponent implements OnInit {
  @Input() tasks: Tasks | null = null;
  @Output() dialogClose = new EventEmitter<Tasks | null>();

  taskForm!: FormGroup;
  originalTask: Tasks | null = null;
  StatusOptions = [
    { label: 'Complete', value: true },
    { label: 'Not Complete', value: false }
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
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      status: [false, Validators.required],
      FullName: ['', Validators.required],
      StudentId: ['', Validators.required],
    });
    
  }
  

  resetForm(): void {
    if (this.tasks) {
      this.taskForm.patchValue({
        name: this.tasks.name,
        date: this.tasks.date,
        status: this.tasks.status,
        FullName: this.tasks.FullName,
        StudentId: this.tasks.StudentId,
      });
    } else {
      this.taskForm.reset({ status: false });
    }
    this.originalTask = { ...this.tasks };
  }

  saveChanges(): void {
    if (this.taskForm.valid) {
      const updatedTask: Tasks = {
        ...this.originalTask,
        ...this.taskForm.value
      };
  
      this.service.addTasks(updatedTask).subscribe({
        next: (response) => {
          console.log('Task added successfully:', response);
          this.messageService.add({ severity: 'success', summary: 'Task added', detail: 'Task has been successfully added.' });
  
          // Close the dialog after a delay
          setTimeout(() => {
            this.dialogClose.emit(updatedTask);
          }, 2000);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error adding Task:', error);
  
          let errorMessage = 'Failed to add Task. Please try again later.';
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
      this.taskForm.markAllAsTouched();
    }
  }
  
  onClose(): void {
    this.dialogClose.emit(null);
    this.resetForm(); // Correctly call the resetForm method
  }
}
