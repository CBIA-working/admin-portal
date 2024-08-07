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
import { Service } from '../service/service';
import { Accomodation } from '../domain/schema';
import { DownloadComponent } from '../download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavigationService } from '../service/navigation.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { EditAccomodationComponent } from './edit-accomodation/edit-accomodation.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AssignAccomodationComponent } from './assign-accomodation/assign-accomodation.component';
import { AddAccomodationComponent } from './add-accomodation/add-accomodation.component';

@Component({
  selector: 'app-accomodation',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    DownloadComponent, ToastModule, FormsModule,OverlayPanelModule, InputGroupModule, 
    InputGroupAddonModule, ChipsModule,DialogModule, EditAccomodationComponent,ConfirmDialogModule,
    AssignAccomodationComponent,AddAccomodationComponent,ReactiveFormsModule
  ],
  providers: [Service, MessageService,ConfirmationService],
  templateUrl: './accomodation.component.html',
  styleUrl: './accomodation.component.scss'
})
export class AccomodationComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;

  accomodations: Accomodation[] = [];
  selectedAccomodation: Accomodation[] = [];
  selectedAccomodations: Accomodation | null = null;
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;
  dialogVisible: boolean = false;
  currentUser: any = {};
  assignDialogVisible: boolean = false;
  selectedAccomodationId: number | null = null;
  addDialogVisible: boolean = false;


  openPdf1InNewTab(): void {
    const pdfUrl1 = this.service.getPdfUrl1();
    window.open(pdfUrl1, '_blank');
  }
  openPdf2InNewTab(): void {
    const pdfUrl2 = this.service.getPdfUrl2();
    window.open(pdfUrl2, '_blank');
  }
  openPdf3InNewTab(): void {
    const pdfUrl3 = this.service.getPdfUrl3();
    window.open(pdfUrl3, '_blank');
  }

  constructor(
    private route: ActivatedRoute,
    private service: Service,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private router: Router,
    private http: HttpClient,
    private confirmationService: ConfirmationService
  ) {}
  showAddDialog() {
    this.addDialogVisible = true;
  }
  onAddDialogClose() {
    this.addDialogVisible = false;
    this.fetchAllAccomodation();
    // Optionally refresh the student list here
  }
  showAssignDialog(accomodationId: number) {
    this.selectedAccomodationId = accomodationId;
    this.assignDialogVisible = true;
  }

  onAssignDialogClose() {
    this.selectedAccomodationId = null;
    this.assignDialogVisible = false;
    this.fetchAllAccomodation();
  }
  showEditDialog(accomodation: Accomodation): void {
    this.selectedAccomodations = accomodation;
    this.dialogVisible = true;
  }
  
  onDialogClose(updatedAccomodation: Accomodation | null): void {
    if (updatedAccomodation) {
      const index = this.accomodations.findIndex(s => s.id === updatedAccomodation.id);
      if (index !== -1) {
        this.accomodations[index] = updatedAccomodation;
      }
    }
    this.selectedAccomodations = null;
    this.dialogVisible = false;
    this.fetchAllAccomodation();
  }

  deleteAccomodation(accomodation: Accomodation): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this cultural event?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteAccomodation(accomodation.id).subscribe(
          () => {
            this.accomodations = this.accomodations.filter(event => event.id !== accomodation.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Cultural event deleted successfully'
            });
          },
          error => {
            console.error('Error deleting cultural event', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete cultural event'
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
    roomNumber:'Room Number',
    buildingName:'Building Name',
    floor:'Floor',
    isSingleOccupancy:'Is Single Occupancy',
    numberOfRoommates:'Number Of Roommates',
    roommateNames:'Roommate Names',
    hostfamily:'Host Family',
    roommateNumber:'Roommate Number',
    // agreement1 :'House_Rules_Agreement',       
    // agreement2 : 'Rental_Agreement_Lease_Agreement',
    // agreement3 :'Security_Deposit_Agreement',         
    userId:'User ID',
  };
  options = [
    { name: 'Students', key: 'managestudent' },

  ];
  navigateToMemberPage(option: { name: string, key: string }, id: string) {
    this.navigationService.setSelectedId(id);
    localStorage.setItem('refreshPage', 'true');
    this.router.navigate([`/${option.key}`], { queryParams: { eventId: id } });
  }

  ngOnInit(): void {
    const studentId = this.route.snapshot.queryParamMap.get('Student_Id');
    if (studentId) {
      this.fetchStudentAccomodations(Number(studentId));
    } else {
      this.fetchAllAccomodation();
    }
  }
  
  fetchStudentAccomodations(studentId: number) {
    this.loading = true;
    this.service.getStudentAccomodation({ Id: studentId, type: 'student' }).then((response) => {
      console.log('Fetched Data:', response); // Check the structure of response here
      this.accomodations = response.map(item => item.accomodationDetails);
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching student events', error);
      this.loading = false;
    });
  }
  
  fetchAllAccomodation() {
    this.loading = true;
    this.service.getAccomodation().then((accomodations) => {
      console.log('Fetched All Accomodations:', accomodations); // Check the structure of accomodations here
      this.accomodations = accomodations;
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching all students', error);
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
    this.selectedAccomodation = [];
  }

  downloadAllStudents(format: string) {
    const data = this.accomodations.map(accomodation => this.mapCustomerToExportFormat(accomodation));
    this.download1(format, data, 'accomodations');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedAccomodation.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one accomodation.'
        });
      } else {
        const data = this.selectedAccomodation.map(accomodation => this.mapCustomerToExportFormat(accomodation));
        this.download2(this.downloadComponent.format, data, 'selected_accomodations');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected accomodations called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(accomodation: Accomodation) {
    return {
      ID: accomodation.id,
      'Room Number': accomodation.roomNumber,
      'Building Name': accomodation.buildingName,
      'Floor': accomodation.floor,
      'Is Single Occupancy': accomodation.roommateNames ? 'No' : 'Yes',
      'Number Of Roommates': accomodation.numberOfRoommates,
      'Roommate Names': accomodation.roommateNames || 'N/A',
      'Host Family': accomodation.hostfamily || 'N/A',
      'Roommate Number': accomodation.roommateNumber || 'N/A',
      // 'Agreemet 1':accomodation.agreement1,
      // 'Agreemet 2':accomodation.agreement2,
      // 'Agreemet 3':accomodation.agreement3,
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
      const rows = this.accomodations.map(accomodation => Object.keys(this.exportHeaderMapping).map(key => accomodation[key]));

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
      const rows = this.selectedAccomodation.map(accomodation => Object.keys(this.exportHeaderMapping).map(key => accomodation[key]));

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
  filterByUserId(userId: string) {
    // Convert search parameter to number
    const userIdNumber = Number(userId);
  
    // Check if the conversion was successful and filter the events
    if (!isNaN(userIdNumber)) {
      this.accomodations = this.accomodations.filter(event => event.userId === userIdNumber);
    } else {
      console.warn('The provided userId is not a valid number.');
      // Optionally, you could handle the case where userId is not valid, like showing an error message or resetting the data.
    }
  }  
  
}
