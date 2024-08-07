import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Service } from '../service/service';
import { CulturalEvent } from '../domain/schema';
import { DownloadComponent } from '../download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageService, ConfirmationService } from 'primeng/api'; // Import ConfirmationService
import { ToastModule } from 'primeng/toast';
import { NavigationService } from '../service/navigation.service';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { EditEventComponent } from './edit-events/edit-events.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AssignEventsComponent } from "./assign-events/assign-events.component";
import { AddEventsComponent } from "./add-events/add-events.component";

@Component({
  selector: 'app-cultural-events',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    DownloadComponent, ToastModule, FormsModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule, DialogModule, EditEventComponent, ConfirmDialogModule,
    AssignEventsComponent,AddEventsComponent
],
  providers: [Service, MessageService, ConfirmationService], // Add ConfirmationService here
  templateUrl: './cultural-events.component.html',
  styleUrls: ['./cultural-events.component.scss']
})
export class CulturalEventsComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;

  culturalEvents: CulturalEvent[] = [];
  selectedCulturalEvent: CulturalEvent[] = [];
  selectedCulturalEvents: CulturalEvent | null = null;
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;
  dialogVisible: boolean = false;
  currentUser: any = {};
  assignDialogVisible: boolean = false;
  selectedEventId: number | null = null;
  addDialogVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private service: Service,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private router: Router,
    private http: HttpClient,
    private confirmationService: ConfirmationService // Inject ConfirmationService
  ) {}

  showAddDialog() {
    this.addDialogVisible = true;
  }
  onAddDialogClose() {
    this.addDialogVisible = false;
    // Optionally refresh the student list here
  }
  showAssignDialog(eventId: number) {
    this.selectedEventId = eventId;
    this.assignDialogVisible = true;
  }

  onAssignDialogClose() {
    this.selectedEventId = null;
    this.assignDialogVisible = false;
  }
  showEditDialog(culturalEvent: CulturalEvent): void {
    this.selectedCulturalEvents = culturalEvent;
    this.dialogVisible = true;
  }
  onDialogClose(updatedCulturalEvent: CulturalEvent | null): void {
    if (updatedCulturalEvent) {
      const index = this.culturalEvents.findIndex(s => s.id === updatedCulturalEvent.id);
      if (index !== -1) {
        this.culturalEvents[index] = updatedCulturalEvent;
      }
    }
    this.selectedCulturalEvent = null;
    this.dialogVisible = false;
  }

  deleteCulturalEvent(culturalEvent: CulturalEvent): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this cultural event?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteCulturalEvent(culturalEvent.id).subscribe(
          () => {
            this.culturalEvents = this.culturalEvents.filter(event => event.id !== culturalEvent.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Cultural event deleted successfully'
            });
          },
          error => {
            console.error('Error deleting cultural event', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete cultural event'
            });
          }
        );
      },
      reject: () => {
        // Optionally handle rejection (user clicks cancel)
      }
    });
  }

  exportHeaderMapping = {
    id: 'ID',
    eventName: 'Event Name',
    date: 'Date',
    description: 'Description',
    signedUp: 'Signed Up',
    userId: 'User ID'
  };

  options = [
    { name: 'Students', key: 'managestudent' },
  ];

  navigateToMemberPage(option: { name: string, key: string }, id: string) {
    this.navigationService.setSelectedId(id);
    localStorage.setItem('refreshPage', 'true');
    this.router.navigate([`/${option.key}`], { queryParams: { eventId: id } });
  }

  ngOnInit(): void {
    const studentId = this.route.snapshot.queryParamMap.get('Student_Id');
    if (studentId) {
      this.fetchStudentEvents(Number(studentId));
    } else {
      this.fetchAllEvents();
    }
  }

  fetchStudentEvents(studentId: number) {
    this.loading = true;
    this.service.getStudentEvents({ Id: studentId, type: 'student' }).then((events) => {
      this.culturalEvents = events.map(event => event.eventDetails);
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching student events', error);
      this.loading = false;
    });
  }

  fetchAllEvents() {
    this.loading = true;
    this.service.getCultural().then((events) => {
      this.culturalEvents = events;
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching all events', error);
      this.loading = false;
    });
  }

  

  ngAfterViewInit() {
    if (this.downloadComponent) {
      this.downloadComponent.downloadAllStudentsEvent.subscribe((format: string) => {
        this.downloadAllStudents(format);
      });
      this.downloadComponent.downloadSelectedStudentsEvent.subscribe((format: string) => {
        this.enterSelectionMode();
      });
    }
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  enterSelectionMode() {
    this.downloadSelectedMode = true;
  }

  exitSelectionMode() {
    this.downloadSelectedMode = false;
    this.selectedCulturalEvent = [];
  }

  downloadAllStudents(format: string) {
    const data = this.culturalEvents.map(culturalEvent => this.mapCustomerToExportFormat(culturalEvent));
    this.download1(format, data, 'culturalEvents');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedCulturalEvent.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one culturalEvent.'
        });
      } else {
        const data = this.selectedCulturalEvent.map(culturalEvent => this.mapCustomerToExportFormat(culturalEvent));
        this.download2(this.downloadComponent.format, data, 'selected_culturalEvents');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected culturalEvents called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(culturalEvent: CulturalEvent) {
    return {
      ID: culturalEvent.id,
      'Event Name': culturalEvent.eventName,
      'Date': culturalEvent.date,
      'Description': culturalEvent.description,
      'Signed Up': culturalEvent.signedUp,
    };
  }

  download1(format: string, data: any[], filename: string) {
    if (format === 'excel') {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Students': worksheet },
        SheetNames: ['Students']
      };
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
  
      doc.setProperties({
        title: `${filename}`,
        author: 'Your Name',
        creator: 'Your App'
      });

      doc.setFont('helvetica');

      const margin = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      };

      doc.text('Students List', margin.left, margin.top);
      const columns = Object.values(this.exportHeaderMapping);
      const rows = this.culturalEvents.map(culturalEvent => Object.keys(this.exportHeaderMapping).map(key => culturalEvent[key]));

      autoTable(doc, {
        margin: { top: 30 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: { textColor: 50 },
        head: [columns],
        body: rows
      });

      doc.save(`${filename}.pdf`);
    }
  }

  download2(format: string, data: any[], filename: string) {
    if (format === 'excel') {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Students': worksheet },
        SheetNames: ['Students']
      };
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
  
      doc.setProperties({
        title: `${filename}`,
        author: 'Your Name',
        creator: 'Your App'
      });

      doc.setFont('helvetica');

      const margin = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      };

      doc.text('Students List', margin.left, margin.top);
      const columns = Object.values(this.exportHeaderMapping);
      const rows = this.selectedCulturalEvent.map(culturalEvent => Object.keys(this.exportHeaderMapping).map(key => culturalEvent[key]));

      autoTable(doc, {
        margin: { top: 30 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: { textColor: 50 },
        head: [columns],
        body: rows
      });

      doc.save(`${filename}.pdf`);
    }
  }

  filterByUserId(userId: string) {
    const userIdNumber = Number(userId);
    if (!isNaN(userIdNumber)) {
      this.culturalEvents = this.culturalEvents.filter(event => event.userId === userIdNumber);
    } else {
      console.warn('The provided userId is not a valid number.');
    }
  }
}
