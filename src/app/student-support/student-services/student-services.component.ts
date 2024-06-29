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
import { CulturalEvent, Customer } from './domain/customer';
import { DownloadComponent } from '../manage-students/download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-student-services',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, 
    InputTextModule, TagModule, DropdownModule, MultiSelectModule, 
    ProgressBarModule, ButtonModule, DownloadComponent, ToastModule
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

  exportHeaderMapping = {
    id: 'ID',
    name: 'Name',
    eventName: 'Event Name',
    date: 'Event Date',
    description: 'Event Description',
    signedUp: 'Signed Up'
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
    if (customer.events.length === 0) {
      return [{
        ID: customer.id,
        Name: `${customer.fname} ${customer.lname}`,
        'Event Name': 'N/A',
        'Event Date': 'N/A',
        'Event Description': 'N/A',
        'Signed Up': 'N/A'
      }];
    } else {
      return customer.events.map(event => ({
        ID: customer.id,
        Name: `${customer.fname} ${customer.lname}`,
        'Event Name': event.eventName || 'N/A',
        'Event Date': event.date || 'N/A',
        'Event Description': event.description || 'N/A',
        'Signed Up': event.signedUp || 'N/A'
      }));
    }
  }

  download(format: string, data: any[], filename: string) {
    if (data.length === 0) {
      data = [{
        ID: 'N/A',
        Name: 'N/A',
        'Event Name': 'N/A',
        'Event Date': 'N/A',
        'Event Description': 'N/A',
        'Signed Up': 'N/A'
      }];
    }

    const columns = Object.values(this.exportHeaderMapping);

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
        title: filename,
        author: 'Your Name',
        creator: 'Your App'
      });

      doc.setFont('helvetica');
      const margin = { top: 20, left: 20, right: 20, bottom: 20 };
      doc.text('Students List', margin.left, margin.top);

      // Convert data to rows for autoTable
      const rows = data.map(row => columns.map(col => row[col]));

      autoTable(doc, {
        margin: { top: 30 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: { textColor: 50 },
        head: [columns],
        body: rows,
        theme: 'striped'
      });

      doc.save(`${filename}.pdf`);
    }
  }
}
