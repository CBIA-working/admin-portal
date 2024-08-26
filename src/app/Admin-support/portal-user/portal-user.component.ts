import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Service } from 'src/app/student-support/service/service';
import { PortalUser } from 'src/app/student-support/domain/schema';
import { AddStudentComponent } from 'src/app/student-support/manage-students/add-student/add-student.component';
import { DownloadComponent } from 'src/app/student-support/download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BulkUploadComponent } from 'src/app/student-support/manage-students/bulk-upload/bulk-upload.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { NavigationService } from 'src/app/student-support/service/navigation.service';
import { EditStudentsComponent } from 'src/app/student-support/manage-students/edit-students/edit-students.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditPortalUserComponent } from "./edit-portal-user/edit-portal-user.component";

@Component({
  selector: 'app-portal-user',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    AddStudentComponent, DownloadComponent, ToastModule, BulkUploadComponent,
    OverlayPanelModule, InputGroupModule, InputGroupAddonModule, ChipsModule,
    EditStudentsComponent, DialogModule, ConfirmDialogModule,
    EditPortalUserComponent
],
  providers: [Service, MessageService,ConfirmationService],
  templateUrl: './portal-user.component.html',
  styleUrl: './portal-user.component.scss'
})
export class PortalUserComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;

  portalUsers!: PortalUser[];
  selectedPortalUsers: PortalUser[] = [];
  selectedPortalUser: PortalUser | null = null;
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;
  defaultSortField: string = 'id'; // The field you want to sort by
  defaultSortOrder: number = 1;
  dialogVisible: boolean = false;
  currentUser: any = {}; // Load current user data here
  addDialogVisible: boolean = false;

  showAddDialog() {
    this.addDialogVisible = true;
  }
  
  onAddDialogClose() {
    this.addDialogVisible = false;
    // Optionally refresh the student list here
  }
  showEditDialog(portalUser: PortalUser): void {
    this.selectedPortalUser = portalUser;
    this.dialogVisible = true;
  }

  onDialogClose(updatedPortalUser: PortalUser | null): void {
    if (updatedPortalUser) {
      const index = this.portalUsers.findIndex(s => s.id === updatedPortalUser.id);
      if (index !== -1) {
        this.portalUsers[index] = updatedPortalUser;
      }
    }
    this.selectedPortalUser = null;
    this.dialogVisible = false;
  }
  deletePortalUsers(portalUser: PortalUser): void {
    // Save the current page index
    const currentPage = this.table.first / this.table.rows;
    
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Portal Users?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteStudents(portalUser.id).subscribe(
          () => {
            this.portalUsers = this.portalUsers.filter(s => s.id !== portalUser.id); // Corrected from this.student to this.students
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Portal User deleted successfully'
            });
            
            // Restore the page index
            this.table.first = currentPage * this.table.rows;
          },
          error => {
            console.error('Error deleting Portal Users', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete Portal Users'
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
    emergencyContactRelation: 'Emergency Contact Relation',
    imageUrl:'Profile image'
  };

  constructor(
    private service: Service,
    private messageService: MessageService,
    private router: Router,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private confirmationService:ConfirmationService
  ) {}

  options = [
    { name: 'Assigned Students', key: 'assignedStudents' },
  ];


  navigateToMemberPage(option: { name: string, key: string }, adminId: string) {
    this.navigationService.setSelectedId(adminId);
    localStorage.setItem('refreshPage', 'true');
    this.router.navigate([`/${option.key}`]);
  }
  


ngOnInit(): void {
  const adminid = this.route.snapshot.queryParamMap.get('adminId');

  if (adminid) {
    this.fetchassignedStudents(Number(adminid));
  }  else {
    this.fetchAllData();
  }
}

private async fetchData(apiCall: () => Promise<any>, type: string) {
  this.loading = true;
  try {
    const response = await apiCall();
    console.log(`Fetched Data (${type}):`, response); // Log the response
    this.portalUsers = response.map(item => item.adminDetails);
  } catch (error) {
    console.error(`Error fetching ${type}`, error);
  } finally {
    this.loading = false;
  }
}

fetchassignedStudents(id: number) {
  this.fetchData(() => this.service.getStudentEvents({ Id: id, type: 'event' }), 'student events');
}

fetchAllData() {
  this.loading = true;
  this.service.getAdmin().then((portalUsers) => {
    this.portalUsers = portalUsers;
    this.loading = false;
  }).catch(error => {
    console.error('Error fetching all portalUsers', error);
    this.loading = false;
  });
}


  ngAfterViewInit() {
    if (this.downloadComponent) {
      this.downloadComponent.downloadAllStudentsEvent.subscribe((format: string) => {
        this.downloadAllPortalUsers(format);
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
    this.selectedPortalUsers = [];
  }
  
  downloadAllPortalUsers(format: string) {
    const data = this.portalUsers.map(portalUsers => this.mapCustomerToExportFormat(portalUsers));
    this.download1(format, data, 'students');
  }

  downloadSelectedPortalUsers() {
    if (this.downloadSelectedMode) {
      if (this.selectedPortalUsers.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one portalUsers.'
        });
      } else {
        const data = this.selectedPortalUsers.map(portalUsers => this.mapCustomerToExportFormat(portalUsers));
        this.download2(this.downloadComponent.format, data, 'selected_students');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected portalUsers called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(portalUser: PortalUser) {
    return {
      ID: portalUser.id,
      'Profile image':portalUser.imageUrl,
      'First Name': portalUser.fname,
      'Last Name': portalUser.lname,
      Email: portalUser.email,
      'Date of Birth': portalUser.dob,
      Address: portalUser.address,
      Gender: portalUser.gender,
      'Blood Group': portalUser.bloodGroup,
      'Dietary Preference': portalUser.dietaryPreference,
      'Emergency Contact Name': portalUser.emergencyContactName,
      'Emergency Contact Number': portalUser.emergencyContactNumber,
      'Emergency Contact Relation': portalUser.emergencyContactRelation
    };
  }

  download1(format: string, data: any[], filename: string) {
    if (format === 'excel') {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'PortalUsers': worksheet },
        SheetNames: ['PortalUsers']
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

      doc.text('PortalUsers List', margin.left, margin.top);
      const columns = Object.values(this.exportHeaderMapping);
      const rows = this.portalUsers.map(portalUsers => Object.keys(this.exportHeaderMapping).map(key => portalUsers[key]));

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
        Sheets: { 'PortalUsers': worksheet },
        SheetNames: ['PortalUsers']
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

      doc.text('PortalUsers List', margin.left, margin.top);
      const columns = Object.values(this.exportHeaderMapping);
      const rows = this.selectedPortalUsers.map(student => Object.keys(this.exportHeaderMapping).map(key => student[key]));

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
