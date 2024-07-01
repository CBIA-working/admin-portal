import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CustomerService } from './service/customerservice';
import { CulturalEvent, Customer,Accommodation } from './domain/customer';
import { DownloadComponent } from '../manage-students/download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-student-services',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, 
    InputTextModule, TagModule, DropdownModule, MultiSelectModule, 
    ProgressBarModule, ButtonModule, DownloadComponent, ToastModule,TooltipModule
  ],
  providers: [CustomerService, MessageService],
  templateUrl: './student-services.component.html',
  styleUrls: ['./student-services.component.scss']
})
export class StudentServicesComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;

  customers: Customer[] = [];
  selectedCustomers: Customer[] = [];
  loading = true;
  searchValue: string | undefined;
  downloadSelectedMode = false;
  culturalEvents: CulturalEvent[] = [];
  accommodations: Accommodation[] = []; // Add this

  exportHeaderMapping = {
    id: 'ID',
    name: 'Name',
    eventName: 'Event Name',
    date: 'Event Date',
    description: 'Event Description',
    signedUp: 'Signed Up',
    roomNumber: 'Room Number', // Add these mappings
    buildingName: 'Building Name',
    floor: 'Floor',
    isSingleOccupancy: 'Single Occupancy',
    numberOfRoommates: 'Number of Roommates',
    roommateNames: 'Roommate Names'
  };

  constructor(
    private customerService: CustomerService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().then((customers) => {
      this.customers = customers;
      this.loadCulturalEvents();
      this.loadAccommodations(); // Add this
    }).catch(error => {
      console.error('Error fetching customers:', error);
      this.loading = false;
    });
  }

  loadCulturalEvents() {
    const customerIds = this.customers.map(c => c.id);
    this.http.post<CulturalEvent[]>('http://localhost:3000/api/CulturalEvent', { userIds: customerIds }).subscribe(
      events => {
        this.culturalEvents = events;
        this.customers.forEach(customer => {
          customer.events = events.filter(e => e.userId === customer.id) || [];
        });
        this.loading = false;
      },
      error => {
        console.error('Error fetching cultural events:', error);
        this.loading = false;
      }
    );
  }

  loadAccommodations() {
    const customerIds = this.customers.map(c => c.id);
    this.http.post<Accommodation[]>('http://localhost:3000/api/Accomodation', { userIds: customerIds }).subscribe(
      accommodations => {
        this.accommodations = accommodations;
        this.customers.forEach(customer => {
          customer.accommodations = accommodations.filter(a => a.userId === customer.id) || [];
        });
      },
      error => {
        console.error('Error fetching accommodations:', error);
      }
    );
  }

  ngAfterViewInit() {
    if (this.downloadComponent) {
      this.downloadComponent.downloadAllStudentsEvent.subscribe((format: string) => {
        this.downloadAllStudents(format);
      });
      this.downloadComponent.downloadSelectedStudentsEvent.subscribe((format: string) => {
        this.enterSelectionMode();
        // Optionally, you can call this.downloadSelectedStudents() here if the event is expected to directly trigger download.
      });
    }
  }

  clear(table: any) {
    table.clear();
    this.searchValue = '';
  }

  enterSelectionMode() {
    this.downloadSelectedMode = true;
  }

  exitSelectionMode() {
    this.downloadSelectedMode = false;
    this.selectedCustomers = [];
  }

  toggleEvent(event: any) {
    event.expanded = !event.expanded;
  }
  toggleAccommodation(accommodation: any) {
    accommodation.expanded = !accommodation.expanded;
  }

  downloadAllStudents(format: string) {
    const data = this.customers.flatMap(customer => this.mapCustomerToExportFormat(customer));
    this.download(format, data, 'students');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedCustomers.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one customer.'
        });
      } else {
        const data = this.selectedCustomers.flatMap(customer => this.mapCustomerToExportFormat(customer));
        this.download(this.downloadComponent.format, data, 'selected_students');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected students called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(customer: Customer) {
    const eventsList = customer.events.length > 0 
      ? customer.events.map(event => event.eventName || 'N/A').join(', ')
      : 'N/A';

    const eventDates = customer.events.length > 0
      ? customer.events.map(event => event.date || 'N/A').join(',')
      : 'N/A';

    const eventDescriptions = customer.events.length > 0
      ? customer.events.map(event => event.description || 'N/A').join(',')
      : 'N/A';

    const signedUps = customer.events.length > 0
      ? customer.events.map(event => event.signedUp ? 'TRUE' : 'FALSE').join(',')
      : 'N/A';

    const accommodationsList = customer.accommodations.length > 0
      ? customer.accommodations.map(accommodation => `${accommodation.roomNumber || 'N/A'}`).join(',')
      : 'N/A';

    const buildingNames = customer.accommodations.length > 0
      ? customer.accommodations.map(accommodation => `${accommodation.buildingName || 'N/A'}`).join(',')
      : 'N/A';

    const floors = customer.accommodations.length > 0
      ? customer.accommodations.map(accommodation => `${accommodation.floor || 'N/A'}`).join(',')
      : 'N/A';

    const singleOccupancies = customer.accommodations.length > 0
      ? customer.accommodations.map(accommodation => accommodation.isSingleOccupancy ? 'Yes' : 'No').join(',')
      : 'N/A';

    const numberOfRoommates = customer.accommodations.length > 0
      ? customer.accommodations.map(accommodation => `${accommodation.numberOfRoommates || 'N/A'}`).join(',')
      : 'N/A';

    const roommateNames = customer.accommodations.length > 0
      ? customer.accommodations.map(accommodation => `${accommodation.roommateNames || 'N/A'}`).join(',')
      : 'N/A';

    return [{
      ID: customer.id,
      Name: `${customer.fname} ${customer.lname}`,
      'Event Name': eventsList,
      'Event Date': eventDates,
      'Event Description': eventDescriptions,
      'Signed Up': signedUps,
      'Room Number': accommodationsList,
      'Building Name': buildingNames,
      'Floor': floors,
      'Single Occupancy': singleOccupancies,
      'Number of Roommates': numberOfRoommates,
      'Roommate Names': roommateNames
    }];
  }



  download(format: string, data: any[], filename: string) {
    if (data.length === 0) {
      data = [{
        ID: 'N/A',
        Name: 'N/A',
        'Event Name': 'N/A',
        'Event Date': 'N/A',
        'Event Description': 'N/A',
        'Signed Up': 'N/A',
        'Room Number': 'N/A',
        'Building Name': 'N/A',
        'Floor': 'N/A',
        'Single Occupancy': 'N/A',
        'Number of Roommates': 'N/A',
        'Roommate Names': 'N/A'
      }];
    }
  
    const columns = Object.values(this.exportHeaderMapping);
  
    if (format === 'excel') {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  
      // Apply styles to the headers
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[cellAddress]) worksheet[cellAddress] = { t: '', v: columns[C] };
        worksheet[cellAddress].s = {
          font: { bold: true },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        };
      }
  
      // Apply borders to all cells
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (worksheet[cellAddress]) {
            worksheet[cellAddress].s = worksheet[cellAddress].s || {};
            worksheet[cellAddress].s.border = {
              top: { style: 'thick' },
              bottom: { style: 'thick' },
              left: { style: 'thick' },
              right: { style: 'thick' }
            };
          }
        }
      }
  
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Students': worksheet },
        SheetNames: ['Students']
      };
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      autoTable(doc, {
        head: [columns],
        body: data.map(item => Object.values(item))
      });
      doc.save(`${filename}.pdf`);
    }
  }
}