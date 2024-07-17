import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Service } from '../../service/service';
import { Courses } from '../../domain/schema';

@Component({
  selector: 'app-edit-courses',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TabViewModule,
    FormsModule,
    DialogModule,
    HttpClientModule,
    CommonModule,
    ToastModule,
  ],
  templateUrl: './edit-courses.component.html',
  styleUrls: ['./edit-courses.component.scss'],
  providers: [MessageService, Service, DatePipe]
})
export class EditCoursesComponent implements OnInit, OnChanges {
  @Input() courses: Courses | null = null;
  @Output() dialogClose: EventEmitter<Courses | null> = new EventEmitter<Courses | null>();

  originalCourses: Courses | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.courses && changes.courses.currentValue) {
      this.courses = {
        ...changes.courses.currentValue,
        startDate: this.formatDate(changes.courses.currentValue.startDate),
        endDate: this.formatDate(changes.courses.currentValue.endDate)
      };
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    if (this.courses) {
      this.originalCourses = { ...this.courses };
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  checkForChanges(): void {
    if (this.courses && this.originalCourses) {
      const courseCopy = { ...this.courses };
      this.showSaveButton = JSON.stringify(courseCopy) !== JSON.stringify(this.originalCourses);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.courses) {
      this.saveSubscription = this.service.getupdateCourse(this.courses)
        .subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Course Updated', detail: 'Will reload to apply the changes.' });
          setTimeout(() => {
            this.dialogClose.emit(this.courses);
          }, 1000);
        }, error => {
          console.error('Error updating course:', error);
        });
    }
  }

  closeDialog(): void {
    this.dialogClose.emit(null);
  }

  private formatDate(date: Date | string): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
}
