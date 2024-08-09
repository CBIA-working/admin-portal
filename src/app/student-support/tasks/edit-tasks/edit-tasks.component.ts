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
import { Tasks } from '../../domain/schema';

@Component({
  selector: 'app-edit-tasks',
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
  providers: [MessageService, Service, DatePipe],
  templateUrl: './edit-tasks.component.html',
  styleUrl: './edit-tasks.component.scss'
})
export class EditTasksComponent implements OnInit, OnChanges {
  @Input() tasks: Tasks | null = null;
  @Output() dialogClose: EventEmitter<Tasks | null> = new EventEmitter<Tasks | null>();

  originalTask: Tasks | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tasks && changes.tasks.currentValue) {
      this.tasks = {
        ...changes.tasks.currentValue,
        date: this.formatDate(changes.tasks.currentValue.date)
      };
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    if (this.tasks) {
      this.originalTask = { ...this.tasks };
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  checkForChanges(): void {
    if (this.tasks && this.originalTask) {
      const taskCopy = { ...this.tasks };
      this.showSaveButton = JSON.stringify(taskCopy) !== JSON.stringify(this.originalTask);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.tasks) {
      this.saveSubscription = this.service.getupdateTasks(this.tasks)
        .subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Tasks Updated', detail: 'Will reload to apply the changes.' });
          setTimeout(() => {
            this.dialogClose.emit(this.tasks);
          }, 1000);
        }, error => {
          console.error('Error updating tasks:', error);
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
