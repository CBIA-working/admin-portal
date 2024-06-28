import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CustomerService } from './service/customerservice';
import { Customer} from './domain/customer';
import { DownloadComponent } from '../manage-students/download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-student-services',
  standalone: true,
  imports: [TableModule,RouterModule,HttpClientModule,CommonModule,InputTextModule,TagModule,
    DropdownModule,MultiSelectModule,ProgressBarModule,ButtonModule,DownloadComponent,ToastModule],
  providers: [CustomerService,MessageService],
  templateUrl: './student-services.component.html',
  styleUrl: './student-services.component.scss'
})
export class StudentServicesComponent implements OnInit {
  @ViewChild('downloadComponent') downloadComponent: any;

  customers: Customer[] = [];
  selectedCustomers: Customer[] = [];
  loading = true;
  searchValue: string | undefined;
  downloadSelectedMode = false;
  culturalEvents: any[] = [];

  exportHeaderMapping = {
    ID: 'ID',
    Name: 'Name',
    'Event Name': 'Event Name',
    'Event Date': 'Event Date',
    'Event Description': 'Event Description',
    'Signed Up': 'Signed Up'
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
      this.loading = false; // Ensure loading spinner stops on error
    });
  }

  loadCulturalEvents() {
    const customerIds = this.customers.map(c => c.id);
    this.http.post<any[]>('http://localhost:3000/api/CulturalEvent', { userIds: customerIds }).subscribe(
      events => {
        this.customers.forEach(customer => {
          const event = events.find(e => e.userId === customer.id);
          if (event) {
            customer.eventName = event.eventName;
            customer.eventDate = event.date;
            customer.eventDescription = event.description;
            customer.signedUp = event.signedUp;
          } else {
            customer.eventName = null;
            customer.eventDate = null;
            customer.eventDescription = null;
            customer.signedUp = null;
          }
        });
        this.loading = false;
      },
      error => {
        console.error('Error fetching cultural events:', error);
        this.loading = false; // Ensure loading spinner stops on error
      }
    );
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
 toggleRowExpansion(customer: Customer) {
    customer.expanded = !customer.expanded;
  }
  downloadAllStudents(format: string) {
    const data = this.customers.map(customer => this.mapCustomerToExportFormat(customer));
    this.downloadData(format, data, 'students');
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
        const data = this.selectedCustomers.map(customer => this.mapCustomerToExportFormat(customer));
        this.downloadData(this.downloadComponent.format, data, 'selected_students');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected students called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(customer: Customer) {
    return {
      ID: customer.id,
      Name: `${customer.fname} ${customer.lname}`,
      'Event Name': customer.eventName,
      'Event Date': customer.eventDate,
      'Event Description': customer.eventDescription,
      'Signed Up': customer.signedUp ? 'Yes' : 'No'
    };
  }

  downloadData(format: string, data: any[], filename: string) {
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
      const rows = data.map(item => Object.values(item));

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