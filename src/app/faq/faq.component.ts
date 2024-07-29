import { CommonModule, DatePipe } from '@angular/common';
import {  HttpClient,HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Service } from '../student-support/service/service';
import { Faq } from '../student-support/domain/schema';
import { DownloadComponent } from '../student-support/download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageService,ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AddFaqComponent } from "./add-faq/add-faq.component";
import { EditFaqComponent } from "./edit-faq/edit-faq.component";

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule, HttpClientModule, TableModule, ButtonModule, DropdownModule,
    InputTextModule, MultiSelectModule, ProgressBarModule, TagModule,
    ToastModule, FormsModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule, DialogModule, ConfirmDialogModule,
    DownloadComponent,AddFaqComponent,EditFaqComponent
],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  providers: [Service, MessageService, ConfirmationService, DatePipe]
})
export class FaqComponent implements OnInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt') table!: Table;

  faqs: Faq[] = [];
  selectedFaqs: Faq[] = [];
  selectedFaq: Faq | null = null;
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;
  dialogVisible: boolean = false;
  addDialogVisible: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private service: Service,
    private messageService: MessageService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) {}

  showAddDialog() {
    this.addDialogVisible = true;
  }
  onAddDialogClose() {
    this.addDialogVisible = false;
    this.fetchAllFaq();
    // Optionally refresh the student list here
  }

  showEditDialog(faq: Faq): void {
    this.selectedFaq = faq;
    this.dialogVisible = true;
  }

  onDialogClose(updatedFaq: Faq | null): void {
    if (updatedFaq) {
      this.selectedFaq = updatedFaq;
      // Optionally refresh the program list here if necessary
    }
    this.dialogVisible = false;
  }

  deleteFaq(faq: Faq): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Faq?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteFaq(faq.id).subscribe(
          () => {
            // Optionally call a method to re-fetch programs after deletion
            this.fetchAllFaq();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Faq deleted successfully'
            });
          },
          error => {
            console.error('Error deleting Faq', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete Faq'
            });
          }
        );
      },
      reject: () => {
        // Optionally handle rejection (user clicks cancel)
      }
    });
  }

  ngOnInit(): void {
    this.fetchAllFaq();
  }

exportHeaderMapping = {
    id: 'ID',
    name: 'Name',
    description: 'Description',
  };

  fetchAllFaq() {
    this.loading = true;
    this.service.getFaq().then(faqs => {
      this.faqs = faqs;
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching FAQs', error);
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
    this.selectedFaqs = [];
  }

  downloadAllStudents(format: string) {
    const data = this.faqs.map(FAQ => this.mapCustomerToExportFormat(FAQ));
    this.download(format, data, 'FAQ');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedFaqs.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one course.'
        });
      } else {
        const data = this.selectedFaqs.map(FAQ => this.mapCustomerToExportFormat(FAQ));
        this.download(this.downloadComponent.format, data, 'selected_courses');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected courses called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(faq: Faq) {
    return {
      ID: faq.id,
      Name: faq.name,
      Batch: faq.description,
    };
  }

  download(format: string, data: any[], filename: string) {
    if (format === 'excel') {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Courses': worksheet },
        SheetNames: ['Courses']
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

      doc.text('Courses List', margin.left, margin.top);
      const columns = Object.values(this.exportHeaderMapping);
      const rows = data.map(course => Object.keys(this.exportHeaderMapping).map(key => course[key]));

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
