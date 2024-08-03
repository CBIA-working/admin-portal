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
import { Marker } from '../../domain/schema';

@Component({
  selector: 'app-edit-marker',
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
  templateUrl: './edit-marker.component.html',
  styleUrls: ['./edit-marker.component.scss']
})
export class EditMarkerComponent implements OnInit, OnChanges {
  private _marker: Marker | null = null;

  @Input() set marker(value: Marker | null) {
    this._marker = { ...value }; // Make a shallow copy when setting marker
    if (value && value.position) {
      this._marker.position = { ...value.position }; // Make a deep copy of position
    }
    this.originalMarker = value ? JSON.parse(JSON.stringify(value)) : null; // Deep copy original marker for comparison
    this.showSaveButton = false; // Reset save button visibility when marker is set
  }

  get marker(): Marker | null {
    return this._marker;
  }

  @Output() dialogClose: EventEmitter<Marker | null> = new EventEmitter<Marker | null>();

  originalMarker: Marker | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;

  constructor(
    private service: Service,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.marker && changes.marker.currentValue) {
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    // Initialized in input setter
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  updateLatitude(value: string) {
    const latitude = parseFloat(value);
    if (!isNaN(latitude) && this._marker && this._marker.position) {
      this._marker.position.lat = latitude;
      this.onFieldChange();
    }
  }

  updateLongitude(value: string) {
    const longitude = parseFloat(value);
    if (!isNaN(longitude) && this._marker && this._marker.position) {
      this._marker.position.lng = longitude;
      this.onFieldChange();
    }
  }

  checkForChanges(): void {
    if (this.marker && this.originalMarker) {
      const currentMarker = JSON.stringify(this.marker);
      const originalMarker = JSON.stringify(this.originalMarker);
      this.showSaveButton = currentMarker !== originalMarker;
      console.log("Changes detected:", currentMarker, originalMarker, this.showSaveButton);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    this.saveSubscription = this.service.getupdateMarker(this.marker)
      .subscribe(response => {
        this.messageService.add({ severity: 'success', summary: 'Marker Updated', detail: 'Marker details updated successfully.' });
        setTimeout(() => {
          this.dialogClose.emit(this.marker);
        }, 1000);
      }, error => {
        console.error('Error updating marker:', error);
      });
  }

  closeDialog(): void {
    this.dialogClose.emit(null);
  }
}
