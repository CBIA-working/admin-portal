import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Service } from 'src/app/student-support/service/service';
import { Faq } from 'src/app/student-support/domain/schema';

@Component({
  selector: 'app-edit-faq',
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
  templateUrl: './edit-faq.component.html',
  styleUrl: './edit-faq.component.scss'
})
export class EditFaqComponent implements OnInit, OnChanges {
  @Input() faq: Faq | null = null;
  @Output() dialogClose: EventEmitter<Faq | null> = new EventEmitter<Faq | null>();

  originalFaq: Faq | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.faq && changes.faq.currentValue) {
      this.originalFaq= { ...this.faq };
      this.checkForChanges();
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    if (this.faq) {
      this.originalFaq = { ...this.faq };
      this.checkForChanges();
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  checkForChanges(): void {
    if (this.faq && this.originalFaq) {
      const faqCopy = { ...this.faq };
      this.showSaveButton = JSON.stringify(faqCopy) !== JSON.stringify(this.originalFaq);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.faq) {
      this.saveSubscription = this.service.getupdateFaq(this.faq)
        .subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Faq Updated', detail: 'Will reload to apply the changes.' });
          setTimeout(() => {
            this.dialogClose.emit(this.faq);
          }, 1000);
        }, error => {
          console.error('Error updating faq:', error);
        });
    }
  }

  closeDialog(): void {
    this.dialogClose.emit(null);
 
  }
}