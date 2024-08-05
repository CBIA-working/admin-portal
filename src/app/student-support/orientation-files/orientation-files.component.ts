import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { OrientationFile } from '../domain/schema';
import { Service } from '../service/service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { MessageService,ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavigationService } from '../service/navigation.service';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditOrientationFileComponent } from "./edit-orientation-file/edit-orientation-file.component";
import { AddOrientationFileComponent } from "./add-orientation-file/add-orientation-file.component";


@Component({
  selector: 'app-orientation-files',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,
    ButtonModule, TooltipModule, TableModule, RouterModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule,
    DownloadComponent, ToastModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule, DialogModule, ConfirmDialogModule, EditOrientationFileComponent, AddOrientationFileComponent],
  providers: [Service, MessageService,ConfirmationService],
  templateUrl: './orientation-files.component.html',
  styleUrl: './orientation-files.component.scss'
})
export class OrientationFilesComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;


  orientationFile: OrientationFile[] = [];
  selectedOrientationFile: OrientationFile[] = [];
  selectedOrientationFiles: OrientationFile | null = null;
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;
  dialogVisible: boolean = false;
  currentUser: any = {};
  addDialogVisible: boolean = false;
 
  constructor(
    private service: Service,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private router: Router,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}


//table
  exportHeaderMapping = {
    id: 'id',
    Name: 'Name',
    Description: 'Description',
    OrientationPdf:'OrientationPdf'
  };

  showEditDialog(orientationFile:OrientationFile ): void {
    this.selectedOrientationFiles = orientationFile;
    this.dialogVisible = true;
  }
  onDialogClose(updatedOrientationFiles: OrientationFile | null): void {
    if (updatedOrientationFiles) {
      const index = this.orientationFile.findIndex(s => s.id === updatedOrientationFiles.id);
      if (index !== -1) {
        this.orientationFile[index] = updatedOrientationFiles;
      }
    }
    this.selectedOrientationFiles = null;
    this.dialogVisible = false;
    window.location.reload();
  }
  
  showAddDialog() {
    this.addDialogVisible = true;
  }
  onAddDialogClose() {
    this.addDialogVisible = false;
    this.fetchAllorientationFile();
  }

  ngOnInit(): void {
    this.fetchAllorientationFile();
  }

  fetchAllorientationFile() {
    this.loading = true;
    this.service.getOrientation().then((orientationFile) => {
      this.orientationFile = orientationFile;
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching all marker', error);
      this.loading = false;
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  openPdfInNewTab(pdfUrl: string) {
    window.open(pdfUrl, '_blank');
  }

  deleteOrientationFile(orientationFile: OrientationFile): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Orientation File?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteOrientation(orientationFile.id).subscribe(
          () => {
            this.orientationFile = this.orientationFile.filter(orientationFile => orientationFile.id !== orientationFile.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'orientation File deleted successfully'
            });
            this.ngOnInit();
          },
          error => {
            console.error('Error deleting orientation File', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete orientation File'
            });
          }
        );
      },
      reject: () => {
        // Optionally handle rejection (user clicks cancel)
      }
    });
  }
  enterSelectionMode() {
    this.downloadSelectedMode = true;
  }

  exitSelectionMode() {
    this.downloadSelectedMode = false;
    this.selectedOrientationFile = [];
  }

  downloadAllStudents(format: string) {
    const data = this.orientationFile.map(orientationFile => this.mapCustomerToExportFormat(orientationFile));
    this.download(format, data, 'orientationFile');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedOrientationFile.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one orientation File.'
        });
      } else {
        const data = this.selectedOrientationFile.map(orientationFile => this.mapCustomerToExportFormat(orientationFile));
        this.download(this.downloadComponent.format, data, 'selected_orientationFile');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected orientationFile called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(orientationFile: OrientationFile) {
    return {
      ID: orientationFile.id,
      Name: orientationFile.Name,
      Description: orientationFile.Description,
      OrientationPdf: orientationFile.OrientationPdf

    };
  }

  download(format: string, data: any[], filename: string) {
    if (format === 'excel') {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Markers': worksheet },
        SheetNames: ['Markers']
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

      doc.text('Markers List', margin.left, margin.top);
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
        head: [],
        body: rows
      });

      doc.save(`${filename}.pdf`);
    }
  }

  
  ngAfterViewInit(): void {
    if (this.downloadComponent) {
      this.downloadComponent.downloadAllStudentsEvent.subscribe((format: string) => {
        this.downloadAllStudents(format);
      });
      this.downloadComponent.downloadSelectedStudentsEvent.subscribe((format: string) => {
        this.enterSelectionMode();
      });
    } 
  }

  
}
