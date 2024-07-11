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
import { Accomodation } from '../../domain/schema';

@Component({
  selector: 'app-edit-accomodation',
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
    AvatarModule
  ],
  templateUrl: './edit-accomodation.component.html',
  styleUrls: ['./edit-accomodation.component.scss'],
  providers: [MessageService, Service, DatePipe]
})
export class EditAccomodationComponent implements OnInit, OnChanges {
  @Input() accomodation: Accomodation | null = null;
  @Output() dialogClose: EventEmitter<Accomodation | null> = new EventEmitter<Accomodation | null>();
  
  originalAccomodation: Accomodation | null = null;
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
    if (changes.accomodation && changes.accomodation.currentValue) {
        // Use DatePipe to format the date properly for the input field
        const formattedDate = this.datePipe.transform(changes.accomodation.currentValue.date, 'yyyy-MM-dd');
        this.accomodation = {
            ...changes.accomodation.currentValue,
            date: formattedDate
        };
        this.cdr.detectChanges();  // Manually trigger change detection to update the view
    }
  }
  
  ngOnInit(): void {
    if (this.accomodation) {
      this.originalAccomodation = { ...this.accomodation };
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  checkForChanges(): void {
    if (this.accomodation && this.originalAccomodation) {
      const accomodationCopy = { ...this.accomodation };
      this.showSaveButton = JSON.stringify(accomodationCopy) !== JSON.stringify(this.originalAccomodation);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.accomodation) {
      this.saveSubscription = this.service.getupdateEvents(this.accomodation)
        .subscribe(response => {
          console.log('Event updated successfully:', response);
          this.messageService.add({ severity: 'success', summary: 'Event Updated', detail: 'Will reload to apply the changes.' });
          setTimeout(() => {
            this.dialogClose.emit(this.accomodation); // Emit the updated event object
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
