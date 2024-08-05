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
import { OrientationFile } from '../../domain/schema';
@Component({
  selector: 'app-edit-orientation-file',
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
  templateUrl: './edit-orientation-file.component.html',
  styleUrl: './edit-orientation-file.component.scss'
})
export class EditOrientationFileComponent implements  OnInit, OnChanges {
  @Input() orientationFile: OrientationFile | null = null;
  @Output() dialogClose: EventEmitter<OrientationFile | null> = new EventEmitter<OrientationFile | null>();

  originalOrientationFile: OrientationFile | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.orientationFile && changes.orientationFile.currentValue) {
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    if (this.orientationFile) {
      this.originalOrientationFile = { ...this.orientationFile };
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  checkForChanges(): void {
    if (this.orientationFile && this.originalOrientationFile) {
      const orientationFileCopy = { ...this.orientationFile };
      this.showSaveButton = JSON.stringify(orientationFileCopy) !== JSON.stringify(this.originalOrientationFile);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.orientationFile) {
      this.saveSubscription = this.service.getupdateOrientation(this.orientationFile)
        .subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Orientation File Updated', detail: 'Will reload to apply the changes.' });
          setTimeout(() => {
            this.dialogClose.emit(this.orientationFile);
          }, 1000);
        }, error => {
          console.error('Error updating orientation File:', error);
        });
    }
  }

  closeDialog(): void {
    this.dialogClose.emit(null);
  }

}