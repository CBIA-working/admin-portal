import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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
import { CulturalEvent } from '../../domain/schema';

@Component({
  selector: 'app-edit-events',
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
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.scss'],
  providers: [MessageService, Service, DatePipe]
})
export class EditEventComponent implements OnInit {
  @Input() culturalEvent: CulturalEvent | null = null;
  @Output() dialogClose: EventEmitter<CulturalEvent | null> = new EventEmitter<CulturalEvent | null>();

  originalculturalEvent: CulturalEvent | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;
  selectedFile: File | null = null; // Store the selected file

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe  // Inject DatePipe
  ) { }

  ngOnInit(): void {
    if (this.culturalEvent && this.culturalEvent.date) {
      // Assuming the date is in a common format like 'MM/DD/YYYY' or 'DD-MM-YYYY'
      const parts = this.culturalEvent.date.split(/[-\/]/);  // This regex splits by both dash and slash
      let formattedDate;
      if (parts.length === 3) {
        // Convert to 'YYYY-MM-DD'
        if (this.culturalEvent.date.includes('/')) {
          // Assuming 'MM/DD/YYYY'
          formattedDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        } else {
          // Assuming 'DD-MM-YYYY'
          formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        this.culturalEvent.date = formattedDate;
      }
    }
  }
  

  onFieldChange(): void {
    this.checkForChanges();
  }

  checkForChanges(): void {
    if (this.culturalEvent && this.originalculturalEvent) {
      const culturalEventCopy = { ...this.culturalEvent };
      this.showSaveButton = JSON.stringify(culturalEventCopy) !== JSON.stringify(this.originalculturalEvent);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.culturalEvent) {
      this.saveSubscription = this.service.getupdateEvents(this.culturalEvent)
        .subscribe(response => {
          console.log('Event updated successfully:', response);
          this.messageService.add({ severity: 'success', summary: 'Event Updated', detail: 'Will reload to apply the changes.' });
          setTimeout(() => {
            this.dialogClose.emit(this.culturalEvent); // Emit the updated event object
          }, 1000);
        }, error => {
          console.error('Error updating event:', error);
        });
    }
  }

  closeDialog(): void {
    this.dialogClose.emit(null);
  }
}
