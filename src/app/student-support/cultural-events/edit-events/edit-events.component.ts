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
export class EditEventComponent implements OnInit, OnChanges {
  @Input() culturalEvent: CulturalEvent | null = null;
  @Output() dialogClose: EventEmitter<CulturalEvent | null> = new EventEmitter<CulturalEvent | null>();

  originalCulturalEvent: CulturalEvent | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;
  selectedFile: File | null = null; // Store the selected file

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe,  // Inject DatePipe
    private cdr: ChangeDetectorRef  // Inject ChangeDetectorRef for manual change detection
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.culturalEvent && changes.culturalEvent.currentValue) {
        // Use DatePipe to format the date properly for the input field
        const formattedDate = this.datePipe.transform(changes.culturalEvent.currentValue.date, 'yyyy-MM-dd');
        this.culturalEvent = {
            ...changes.culturalEvent.currentValue,
            date: formattedDate
        };
        this.cdr.detectChanges();  // Manually trigger change detection to update the view
    }
  }
  
  ngOnInit(): void {
    if (this.culturalEvent) {
      this.originalCulturalEvent = { ...this.culturalEvent };
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  checkForChanges(): void {
    if (this.culturalEvent && this.originalCulturalEvent) {
      const culturalEventCopy = { ...this.culturalEvent };
      this.showSaveButton = JSON.stringify(culturalEventCopy) !== JSON.stringify(this.originalCulturalEvent);
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
