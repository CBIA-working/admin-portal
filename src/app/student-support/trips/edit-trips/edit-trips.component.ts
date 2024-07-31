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
import { Trip } from '../../domain/schema';

@Component({
  selector: 'app-edit-trips',
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
  templateUrl: './edit-trips.component.html',
  styleUrl: './edit-trips.component.scss'
})
export class EditTripsComponent implements OnInit, OnChanges {
  @Input() trips: Trip | null = null;
  @Output() dialogClose: EventEmitter<Trip | null> = new EventEmitter<Trip | null>();

  originalTrip: Trip | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.trips && changes.trips.currentValue) {
      this.trips = {
        ...changes.trips.currentValue,
        DepartureDate: this.formatDate(changes.trips.currentValue.DepartureDate),
        ReturnDate: this.formatDate(changes.trips.currentValue.ReturnDate)
      };
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    if (this.trips) {
      this.originalTrip = { ...this.trips };
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  checkForChanges(): void {
    if (this.trips && this.originalTrip) {
      const tripCopy = { ...this.trips };
      this.showSaveButton = JSON.stringify(tripCopy) !== JSON.stringify(this.originalTrip);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.trips) {
      this.saveSubscription = this.service.getupdateTrips(this.trips)
        .subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Trips Updated', detail: 'Will reload to apply the changes.' });
          setTimeout(() => {
            this.dialogClose.emit(this.trips);
          }, 1000);
        }, error => {
          console.error('Error updating trip:', error);
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
