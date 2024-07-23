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
import { KeyProgramDate } from '../../domain/schema';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-editkeyprogramdate',
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
    CalendarModule,
  ],
  providers: [MessageService, Service, DatePipe],
  templateUrl: './editkeyprogramdate.component.html',
  styleUrls: ['./editkeyprogramdate.component.scss']
})
export class EditkeyprogramdateComponent implements OnInit, OnChanges {
  @Input() keyProgramDate: KeyProgramDate | null = null;
  @Output() dialogClose: EventEmitter<KeyProgramDate | null> = new EventEmitter<KeyProgramDate | null>();

  originalKeyProgramDate: KeyProgramDate | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['keyProgramDate'] && changes['keyProgramDate'].currentValue) {
      if (changes['keyProgramDate'].currentValue.date) {
        const formattedDate = this.datePipe.transform(changes['keyProgramDate'].currentValue.date, 'yyyy-MM-dd');
        this.keyProgramDate = {
          ...changes['keyProgramDate'].currentValue,
          date: formattedDate ? new Date(formattedDate) : new Date()
        };
      } else {
        console.warn('Received incomplete keyProgramDate:', changes['keyProgramDate'].currentValue);
      }
      this.cdr.detectChanges();  // Ensure view updates with new input
    }
  }

  ngOnInit(): void {
    if (this.keyProgramDate) {
      this.originalKeyProgramDate = {...this.keyProgramDate};
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  checkForChanges(): void {
    if (this.keyProgramDate && this.originalKeyProgramDate) {
      const keyProgramDateCopy = {...this.keyProgramDate};
      this.showSaveButton = JSON.stringify(keyProgramDateCopy) !== JSON.stringify(this.originalKeyProgramDate);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.keyProgramDate) {
      const timeString = this.formatTime(this.keyProgramDate.time);
      this.keyProgramDate.time = timeString;
      this.saveSubscription = this.service.getupdatekeyprogramdates(this.keyProgramDate)
        .subscribe(response => {
          console.log('Event updated successfully:', response);
          this.messageService.add({ severity: 'success', summary: 'Event Updated', detail: 'Event details updated successfully.' });
          setTimeout(() => {
            this.dialogClose.emit(this.keyProgramDate);  // Emit the updated event object
          }, 1000);
        }, error => {
          console.error('Error updating event:', error);
          this.messageService.add({ severity: 'error', summary: 'Update Failed', detail: 'Failed to update event details.' });
        });
    }
  }

  closeDialog(): void {
    this.dialogClose.emit(null);
  }

  formatTime(time: Date | string): string {
    if (time instanceof Date) {
      return `${time.getHours()}:${time.getMinutes()}`;
    }
    return time;
  }
}
