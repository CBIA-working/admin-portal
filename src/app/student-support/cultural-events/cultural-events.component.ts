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
import { Service } from '../service/service';
import { CulturalEvent } from '../domain/schema';
import { DownloadComponent } from '../download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavigationService } from '../service/navigation.service';// Import the service
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cultural-events',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    DownloadComponent, ToastModule,FormsModule
  ],
  providers: [Service, MessageService],
  templateUrl: './cultural-events.component.html',
  styleUrls: ['./cultural-events.component.scss']
})
export class CulturalEventsComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;

  culturalEvents!: CulturalEvent[];
  selectedCulturalEvent: CulturalEvent[] = [];
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;

  exportHeaderMapping = {
    id: 'ID',
    eventName: 'Event Name',
    date: 'Date',
    description: 'Description',
    signedUp: 'Signed Up'
  };

  constructor(
    private service: Service,
    private messageService: MessageService,
    private navigationService: NavigationService // Inject the service
  ) {}

  ngOnInit() {
    this.service.getCultural().then((culturalEvents) => {
      this.culturalEvents = culturalEvents;
      this.loading = false;

      const studentId = this.navigationService.getSelectedId();
      if (studentId) {
        this.searchValue = studentId;
        this.filterTable(studentId);
      }
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
      'Signed Up': culturalEvent.signedUp
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

  filterTable(searchValue: string) {
    if (this.table) {
      this.table.filterGlobal(searchValue, 'contains');
    }
  }
}
