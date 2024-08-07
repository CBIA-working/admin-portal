import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Library } from '../../domain/schema';
import { Service } from '../../service/service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DownloadComponent } from '../../download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageService,ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavigationService } from '../../service/navigation.service';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-librarytable',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,
    ButtonModule, TooltipModule, TableModule, RouterModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule,
    DownloadComponent, ToastModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule, DialogModule, ConfirmDialogModule],
  providers: [Service, MessageService,ConfirmationService],
  templateUrl: './librarytable.component.html',
  styleUrl: './librarytable.component.scss'
})
export class LibrarytableComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;

  library: Library[] = [];
  selectedLibrary: Library[] = [];
  selectedLibrarys: Library | null = null;
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;
  dialogVisible: boolean = false;
  currentUser: any = {};
  addDialogVisible: boolean = false;
  statusColors: { [status: string]: string } = {};

  // Function to get the color for a given status
  getColorForStatus(status: string): string {
    // If the color has not been assigned yet, generate and assign it
    if (!this.statusColors[status]) {
      this.statusColors[status] = this.generateRandomColor();
    }
    return this.statusColors[status];
  }

  // Function to generate a random color
  private generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  
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
    Status:'Status',
    LibraryPdf:'LibraryPdf'
  };

  showEditDialog(library:Library ): void {
    this.selectedLibrarys = library;
    this.dialogVisible = true;
  }
  onDialogClose(updatedLibrary: Library | null): void {
    if (updatedLibrary) {
      const index = this.library.findIndex(s => s.id === updatedLibrary.id);
      if (index !== -1) {
        this.library[index] = updatedLibrary;
      }
    }
    this.selectedLibrarys = null;
    this.dialogVisible = false;
    window.location.reload();
  }
  
  showAddDialog() {
    this.addDialogVisible = true;
  }
  onAddDialogClose() {
    this.addDialogVisible = false;
    this.fetchAllLibrary();
  }

  navigateToMemberPage(option: { name: string, key: string }, id: string) {
    this.navigationService.setSelectedId(id);
    localStorage.setItem('refreshPage', 'true');
    this.router.navigate([`/${option.key}`], { queryParams: { courseId: id } });
  }

  ngOnInit(): void {
    const programid = this.route.snapshot.queryParamMap.get('programId');
    if (programid) {
      this.fetchLibraryProgram(Number(programid));
    }  else {
      this.fetchAllLibrary();
    }
  }

  fetchLibraryProgram(programId: number) {
    this.loading = true;
    this.service.getLibraryProgram({ Id: programId, type: 'program' }).then((response) => {
      this.library = response.map(item => item.libraryDetails);
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching programs', error);
      this.loading = false;
    });
  }


  fetchAllLibrary() {
    this.loading = true;
    this.service.getLibrary().then((library) => {
      this.library = library;
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching all students', error);
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

  deleteLibrary(library: Library): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Library?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteLibrary(library.id).subscribe(
          () => {
            this.library = this.library.filter(library => library.id !== library.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'library File deleted successfully'
            });
            this.ngOnInit();
          },
          error => {
            console.error('Error deleting library', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete library'
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
    this.selectedLibrary = [];
  }

  downloadAllStudents(format: string) {
    const data = this.library.map(library => this.mapCustomerToExportFormat(library));
    this.download(format, data, 'library');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedLibrary.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one library.'
        });
      } else {
        const data = this.selectedLibrary.map(library => this.mapCustomerToExportFormat(library));
        this.download(this.downloadComponent.format, data, 'selected_library');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected library called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(library: Library) {
    return {
      ID: library.id,
      Name: library.Name,
      Description: library.Description,
      Status: library.Status,
      LibraryPdf: library.LibraryPdf

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

