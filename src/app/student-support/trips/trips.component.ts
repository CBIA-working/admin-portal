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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Service } from '../service/service';
import { Trip } from '../domain/schema';
import { EditTripsComponent } from './edit-trips/edit-trips.component';
import { AssignTripsComponent } from './assign-trips/assign-trips.component';
import { AddTripsComponent } from './add-trips/add-trips.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    DownloadComponent, ToastModule, FormsModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule, DialogModule, ConfirmDialogModule,EditTripsComponent,
    AssignTripsComponent,AddTripsComponent,TooltipModule
],
  providers: [Service, MessageService, ConfirmationService], // Add ConfirmationService here
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss'
})
export class TripsComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;

  trips: Trip[] = [];
  selectedTrip: Trip[] = [];
  selectedTrips: Trip | null = null;
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;
  dialogVisible: boolean = false;
  currentUser: any = {};
  assignDialogVisible: boolean = false;
  selectedTripId: number | null = null;
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
  showAssignDialog(tripId: number) {
    this.selectedTripId = tripId;
    this.assignDialogVisible = true;
  }

  onAssignDialogClose() {
    this.selectedTripId = null;
    this.assignDialogVisible = false;
  }
  showEditDialog(trips: Trip): void {
    this.selectedTrips = trips;
    this.dialogVisible = true;
  }
  onDialogClose(updatedTrip: Trip | null): void {
    if (updatedTrip) {
      const index = this.trips.findIndex(t => t.id === updatedTrip.id);
      if (index !== -1) {
        this.trips[index] = updatedTrip;
      }
    }
    this.selectedTrip = null;
    this.dialogVisible = false;
  }

  deleteTrip(trip: Trip): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Trip?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteTrip(trip.id).subscribe(
          () => {
            // Corrected the filtering logic
            this.trips = this.trips.filter(t => t.id !== trip.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Trip deleted successfully'
            });
            this.fetchAllTrips(); // Fetch the latest list of trips
          },
          error => {
            console.error('Error deleting Trip', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete Trip'
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
    TripName: 'Trip Name',
    Location:'Location',
    DepartureDate: 'Departure Date',
    ReturnDate: 'Return Date',
    FullName:'Full Name',
    StudentId:'Student Id',
    PhoneNumber:'PhoneNumber',
    Purpose: 'Purpose',
    GoingFormFilled: 'Going Form Filled'
  };

  options = [
    { name: 'Students', key: 'managestudent' },
  ];

  navigateToMemberPage(option: { name: string, key: string }, id: string) {
    this.navigationService.setSelectedId(id);
    localStorage.setItem('refreshPage', 'true');
    this.router.navigate([`/${option.key}`], { queryParams: { tripId: id } });
  }

  ngOnInit(): void {
    console.log(this.trips);

    const studentId = this.route.snapshot.queryParamMap.get('Student_Id');
    if (studentId) {
      this.fetchStudentTrips(Number(studentId));
    } else {
      this.fetchAllTrips();
    }
  }

  fetchStudentTrips(studentId: number) {
    this.loading = true;
    this.service.getStudentTrips({ Id: studentId, type: 'student' }).then((trips) => {
      this.trips = trips.map(trips => trips.tripDetails);
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching student events', error);
      this.loading = false;
    });
  }

  fetchAllTrips() {
    this.loading = true;
    this.service.getTrip().then((trips) => {
      this.trips = trips;
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching all trips', error);
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
    this.selectedTrip = [];
  }

  downloadAllStudents(format: string) {
    const data = this.trips.map(culturalEvent => this.mapCustomerToExportFormat(culturalEvent));
    this.download1(format, data, 'trips');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedTrip.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one culturalEvent.'
        });
      } else {
        const data = this.selectedTrip.map(culturalEvent => this.mapCustomerToExportFormat(culturalEvent));
        this.download2(this.downloadComponent.format, data, 'selected_trips');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected trips called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(trip: Trip) {
    return {
      ID: trip.id,
      'TripName': trip.TripName,
      'Location': trip.Location,
      'Departure Date': trip.DepartureDate,
      'Return Date': trip.ReturnDate,
      'Full Name': trip.FullName,
      'Student Id': trip.StudentId,
      'Phone Number': trip.PhoneNumber,
      'Purpose': trip.Purpose,
      'Going Form Filled': trip.GoingFormFilled,
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
      const rows = this.trips.map(culturalEvent => Object.keys(this.exportHeaderMapping).map(key => culturalEvent[key]));

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
      const rows = this.selectedTrip.map(culturalEvent => Object.keys(this.exportHeaderMapping).map(key => culturalEvent[key]));

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

}

