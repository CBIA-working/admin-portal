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
import { Courses } from '../../domain/schema';


@Component({
  selector: 'app-add-courses',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CheckboxModule, CardModule, CalendarModule,
    ButtonModule, TabViewModule, FormsModule, HttpClientModule, ToastModule,
    DropdownModule, InputTextModule, InputTextareaModule, MessageModule, DialogModule
  ],
  providers: [MessageService],
  templateUrl: './add-courses.component.html',
  styleUrls: ['./add-courses.component.scss']
})
export class AddCoursesComponent implements OnInit {
  @Input() course: Courses | null = null;
  @Output() dialogClose = new EventEmitter<Courses | null>();

  courseForm!: FormGroup;
  originalCourse: Courses | null = null;

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
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      keyDates: ['', Validators.required],
      events: ['', Validators.required],
      agreements: ['', Validators.required]
    });
  }

  resetForm(): void {
    if (this.course) {
      this.courseForm.patchValue({
        title: this.course.title,
        description: this.course.description,
        startDate: this.course.startDate,
        endDate: this.course.endDate,
        keyDates: this.course.keyDates,
        events: this.course.events,
        agreements: this.course.agreements
      });
    } else {
      this.courseForm.reset();
    }
    this.originalCourse = { ...this.course };
  }

  saveChanges(): void {
    if (this.courseForm.valid) {
      const updatedCourse: Courses = {
        ...this.originalCourse,
        ...this.courseForm.value
      };

      this.service.addCourse(updatedCourse).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Course added', detail: 'Course has been successfully added.' });

          // Close the dialog after a delay
          setTimeout(() => {
            this.dialogClose.emit(updatedCourse);
          }, 2000); // Adjust the delay time as needed (2000 ms = 2 seconds)
        },
        error: (error) => {
          console.error('Error adding course:', error);

          let errorMessage = 'Failed to add course. Please try again later.';
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
      this.courseForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.dialogClose.emit(null);
    this.resetForm(); // Correctly call the resetForm method
  }
}
