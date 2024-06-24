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

@Component({
  selector: 'app-manage-students',
  standalone:true,
  imports: [TableModule, RouterModule, 
    HttpClientModule, 
    CommonModule, InputTextModule, TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    AddStudentComponent,DownloadComponent],
  providers: [CustomerService],
  templateUrl: './manage-students.component.html',
  styleUrl: './manage-students.component.scss'
})
export class ManageStudentsComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;

  customers!: Customer[];
  loading: boolean = true;
  searchValue: string | undefined;

  // Define mapping for export headers
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

  constructor(private customerService: CustomerService) {}

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
    }
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  downloadAllStudents(format: string) {
    if (format === 'excel') {
      // Excel export logic (unchanged)
    } else if (format === 'pdf') {
      const doc = new jsPDF();
  
      // Set document properties
      doc.setProperties({
        title: 'Students List',
      });
  
      // Set font
      doc.setFont('helvetica');
  
      // Set margins
      const margin = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      };
  
      // Add content
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
  
      // Save the PDF
      doc.save('students.pdf');
    }
  }
}  