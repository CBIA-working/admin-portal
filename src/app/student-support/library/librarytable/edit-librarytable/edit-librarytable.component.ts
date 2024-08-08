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
import { MessageService, SelectItem } from 'primeng/api';
import { Service } from 'src/app/student-support/service/service';
import { Library } from 'src/app/student-support/domain/schema';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-edit-librarytable',
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
    DropdownModule
  ],
  providers: [MessageService, Service, DatePipe],
  templateUrl: './edit-librarytable.component.html',
  styleUrl: './edit-librarytable.component.scss'
})
export class EditLibrarytableComponent  implements  OnInit, OnChanges {

  @Input() library: Library | null = null;
  @Output() dialogClose: EventEmitter<Library | null> = new EventEmitter<Library | null>();

  originalLibrary: Library | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;
  statusOptions: SelectItem[] = [];

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.library) {
      console.log('Library input changed', changes.library);
      this.loadStatusOptions(); // Reload status options if the library object changes
    }
  }

  ngOnInit(): void {
    console.log('Component initializing...');
    this.loadStatusOptions(); // Load status options on init
  }

  loadStatusOptions(): void {
    this.service.getProgram().then(data => {
      this.statusOptions = data.map((item: any) => ({
        label: item.name,
        value: item.name
      }));
      console.log('Status options:', this.statusOptions);

      // Ensure the dropdown updates after the statuses are loaded
      if (this.library && this.library.Status) {
        const matchedStatus = this.statusOptions.find(option => option.value === this.library.Status);
        if (matchedStatus) {
          this.library.Status = matchedStatus.value;
          console.log('Setting selected status:', this.library.Status);
        } else {
          console.log('No matching status found for:', this.library.Status);
        }
      } else {
        console.log('Library status is not set');
      }
      this.cdr.detectChanges(); // Update the view
    }).catch(error => {
      console.error('Error fetching statuses:', error);
    });
  }
  onStatusChange(): void {
    this.showSaveButton = true;
    console.log('Status changed, save button enabled');
  }
  onFieldChange(): void {
    this.checkForChanges();
    this.onStatusChange();
  }

  checkForChanges(): void {
    if (this.library && this.originalLibrary) {
      const libraryCopy = { ...this.library };
      this.showSaveButton = JSON.stringify(libraryCopy) !== JSON.stringify(this.originalLibrary);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.library) {
      this.saveSubscription = this.service.getupdateLibrary(this.library)
        .subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Library Updated', detail: 'Will reload to apply the changes.' });
          setTimeout(() => {
            this.dialogClose.emit(this.library);
          }, 1000);
        }, error => {
          console.error('Error updating Library:', error);
        });
    }
  }

  closeDialog(): void {
    this.dialogClose.emit(null);
  }

}
