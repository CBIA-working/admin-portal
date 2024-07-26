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
import { Service } from '../../service/service';
import { Program } from '../../domain/schema';

@Component({
  selector: 'app-edit-program',
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
  templateUrl: './edit-program.component.html',
  styleUrl: './edit-program.component.scss',
  providers: [MessageService, Service, DatePipe]
})
export class EditProgramComponent implements OnInit, OnChanges {
  @Input() program: Program | null = null;
  @Output() dialogClose: EventEmitter<Program | null> = new EventEmitter<Program | null>();

  originalProgram: Program | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;

  constructor(
    private service: Service,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.program && changes.program.currentValue) {
      this.originalProgram = { ...this.program };
      this.checkForChanges();
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    if (this.program) {
      this.originalProgram = { ...this.program };
      this.checkForChanges();
    }
  }

  onFieldChange(): void {
    this.checkForChanges();
  }

  checkForChanges(): void {
    if (this.program && this.originalProgram) {
      const programCopy = { ...this.program };
      this.showSaveButton = JSON.stringify(programCopy) !== JSON.stringify(this.originalProgram);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.program) {
      this.saveSubscription = this.service.getupdateProgram(this.program)
        .subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Program Updated', detail: 'Will reload to apply the changes.' });
          setTimeout(() => {
            this.dialogClose.emit(this.program);
          }, 1000);
        }, error => {
          console.error('Error updating program:', error);
        });
    }
  }

  closeDialog(): void {
    this.dialogClose.emit(null);
 
  }
}