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
    if (changes.orientationFile && changes.orientationFile.currentValue) {
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    this.loadStatusOptions().then(() => {
      if (this.library) {
        this.originalLibrary = { ...this.library };
      }
      this.cdr.detectChanges(); // Trigger change detection manually once everything is loaded
    });
  }
  onStatusChange(): void {
    // This function gets triggered when the dropdown value changes
    this.cdr.detectChanges(); // Manually trigger change detection if necessary
  }
  
  loadStatusOptions() {
    return this.service.getProgram().then(data => {
      this.statusOptions = data.map((item: any) => ({
        label: item.name,
        value: item.name
      }));
    }).catch(error => {
      console.error('Error fetching statuses:', error);
    });
  }

  onFieldChange(): void {
    this.checkForChanges();
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
