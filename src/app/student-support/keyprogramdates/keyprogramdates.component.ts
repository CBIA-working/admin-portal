import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Service } from '../service/service';
import { KeyProgramDate } from '../domain/schema';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService, PrimeTemplate } from 'primeng/api';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { AddKeyProgramDateComponent } from './addkeyprogramdate/addkeyprogramdate.component';
import { ToastModule } from 'primeng/toast';
import { EditkeyprogramdateComponent } from './editkeyprogramdate/editkeyprogramdate.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-keyprogramdates',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, 
    CalendarModule, CardModule, ButtonModule, PrimeTemplate, 
    OverlayPanelModule, AddKeyProgramDateComponent, ToastModule, DialogModule,
    EditkeyprogramdateComponent,DialogModule,InputTextModule,TagModule, ButtonModule,
    ToastModule, FormsModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule,ConfirmDialogModule,],
  providers: [Service, MessageService, ConfirmationService],
  templateUrl: './keyprogramdates.component.html',
  styleUrls: ['./keyprogramdates.component.scss']
})
export class KeyprogramdatesComponent implements OnInit {
  @ViewChild('addKeyProgramDateOverlay') addKeyProgramDateOverlay: OverlayPanel;

  currentMonthDates: KeyProgramDate[] = [];
  events: { [date: string]: KeyProgramDate[] } = {};  // Events by date
  selectedDateEvents: KeyProgramDate[] = [];
  showDetails: boolean = false;
  dialogVisible: boolean = false;
  keyProgramDate: KeyProgramDate[] = [];
  selectedKeyprogramdate: KeyProgramDate[] = [];

  constructor(
    private service: Service,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService 
  ) {}

  showEditDialog(keyProgramDate: KeyProgramDate): void {
    this.selectedKeyprogramdate = [keyProgramDate];
    this.dialogVisible = true;
    this.cdr.detectChanges();
  }

  onDialogClose(updatedKeyProgramDate: KeyProgramDate | null): void {
    if (updatedKeyProgramDate && this.selectedKeyprogramdate.length > 0) {
      const index = this.currentMonthDates.findIndex(s => s.id === updatedKeyProgramDate.id);
      if (index !== -1) {
        this.currentMonthDates[index] = updatedKeyProgramDate;
      }
    }
    this.dialogVisible = false;
    this.selectedKeyprogramdate = [];
    this.cdr.detectChanges();
  }

  onSubmitSuccess(): void {
    // Hide the overlay panel
    if (this.addKeyProgramDateOverlay) {
      setTimeout(() => this.addKeyProgramDateOverlay.hide(), 1500);
    }
  }

  deleteKeyprogramdate(keyprogramdate: KeyProgramDate): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Key Program Date?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteKeyProgramDates(keyprogramdate.id).subscribe(
          () => {
            this.currentMonthDates = this.currentMonthDates.filter(event => event.id !== keyprogramdate.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Key Program Date deleted successfully'
            });
          },
          error => {
            console.error('Error deleting Key Program Date', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete Key Program Date'
            });
          }
        );
      },
      reject: () => {
        // Optionally handle rejection (user clicks cancel)
      }
    });
  }

  ngOnInit() {
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are zero-indexed
    this.loadKeyProgramDates(currentMonth);
  }

  loadKeyProgramDates(month: number): void {
    this.service.getKeyProgramDates(month).then(data => {
      // Combine all month data into a single array
      const allDates = [...data.prevMonthDates, ...data.currentMonthDates, ...data.nextMonthDates];

      this.currentMonthDates = allDates;
      this.events = allDates.reduce((acc, event) => {
        // Convert UTC date to local date
        const eventDate = new Date(event.date);
        const dateStr = eventDate.toLocaleDateString();  // Using locale date string for key
        if (!acc[dateStr]) {
          acc[dateStr] = [];
        }
        acc[dateStr].push(event);
        return acc;
      }, {});
    }).catch(error => {
      console.error('Failed to fetch key program dates:', error);
      this.currentMonthDates = [];
      this.events = {};
    });
  }

  onDateSelect(event: any): void {
    const selectedDate = new Date(event).toLocaleDateString();
    this.selectedDateEvents = this.events[selectedDate] || [];
    this.showDetails = this.selectedDateEvents.length > 0;
  }

  onMonthChange(event: any): void {
    const newMonth = event.month + 1; // PrimeNG months are zero-indexed
    this.loadKeyProgramDates(newMonth);
  }

  hasEvents(date: any): boolean {
    // Ensure comparison is done using local date
    const checkDate = new Date(date.year, date.month, date.day);
    const dateStr = checkDate.toLocaleDateString();
    return this.events[dateStr] ? true : false;
  }

  dateToString(date: any): string {
    const checkDate = new Date(date.year, date.month, date.day);
    return checkDate.toLocaleDateString();  // This should match the format used in loadKeyProgramDates
  }
}
