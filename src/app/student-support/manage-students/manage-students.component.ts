import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
import { Customer, Representative,} from './domain/customer';
import { AddStudentComponent } from './add-student/add-student.component';
import { DownloadComponent } from './download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';

@Component({
  selector: 'app-manage-students',
  standalone:true,
  imports: [TableModule, RouterModule, 
    HttpClientModule, 
    CommonModule, InputTextModule, 
    TagModule, DropdownModule, MultiSelectModule, 
    ProgressBarModule, ButtonModule,
    AddStudentComponent,DownloadComponent,
    ToastModule,BulkUploadComponent],
  providers: [CustomerService,MessageService],
  templateUrl: './manage-students.component.html',
  styleUrl: './manage-students.component.scss'
})

export class ManageStudentsComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;

  customers!: Customer[];
  selectedCustomers: Customer[] = [];
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;

  exportHeaderMapping = {
    id: 'ID',
    fname: 'First Name',
    lname: 'Last Name',
    email: 'Email',
    dob: 'Date of Birth',
    address: 'Address',
    gender: 'Gender',
    bloodGroup: 'Blood Group',
    dietaryPreference: 'Dietary Preference',
    emergencyContactName: 'Emergency Contact Name',
    emergencyContactNumber: 'Emergency Contact Number',
    emergencyContactRelation: 'Emergency Contact Relation'
  };

  constructor(
    private customerService: CustomerService ,
    private messageService: MessageService) {}

  ngOnInit() {
    this.customerService.getCustomers().then((customers) => {
      this.customers = customers;
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
        // Optionally, you can call this.downloadSelectedStudents() here if the event is expected to directly trigger download.
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
    this.selectedCustomers = [];
  }
  


  downloadAllStudents(format: string) {
    const data = this.customers.map(customer => this.mapCustomerToExportFormat(customer));
    this.download1(format, data, 'students');
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
        this.download2(this.downloadComponent.format, data, 'selected_students');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected students called but not in selection mode.');
    }
  }
  


  mapCustomerToExportFormat(customer: Customer) {
    return {
      ID: customer.id,
      'First Name': customer.fname,
      'Last Name': customer.lname,
      Email: customer.email,
      'Date of Birth': customer.dob,
      Address: customer.address,
      Gender: customer.gender,
      'Blood Group': customer.bloodGroup,
      'Dietary Preference': customer.dietaryPreference,
      'Emergency Contact Name': customer.emergencyContactName,
      'Emergency Contact Number': customer.emergencyContactNumber,
      'Emergency Contact Relation': customer.emergencyContactRelation
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
  
      // Set document properties
      doc.setProperties({
        title: `${filename}`,
        author: 'Your Name',
        creator: 'Your App'
      });

      doc.setFont('helvetica');

    // Set margins
    const margin = {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20
    };

    doc.text('Students List', margin.left, margin.top);
    const columns = Object.values(this.exportHeaderMapping);
    const rows = this.customers.map(customer => Object.keys(this.exportHeaderMapping).map(key => customer[key]));

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
  
      // Set document properties
      doc.setProperties({
        title: `${filename}`,
        author: 'Your Name',
        creator: 'Your App'
      });

      doc.setFont('helvetica');

    // Set margins
    const margin = {
      top: 20,
      left: 20,
      right: 20,
      bottom: 20
    };

    doc.text('Students List', margin.left, margin.top);
    const columns = Object.values(this.exportHeaderMapping);
    const rows = this.selectedCustomers.map(customer => Object.keys(this.exportHeaderMapping).map(key => customer[key]));
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
