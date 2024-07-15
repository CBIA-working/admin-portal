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
import { Service } from '../service/service';
import { Student } from '../domain/schema';
import { AddStudentComponent } from './add-student/add-student.component';
import { DownloadComponent } from '../download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { NavigationService } from '../service/navigation.service'; // Import the service
import { EditStudentsComponent } from './edit-students/edit-students.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    AddStudentComponent, DownloadComponent, ToastModule, BulkUploadComponent, 
    OverlayPanelModule, InputGroupModule, InputGroupAddonModule, ChipsModule,
    EditStudentsComponent,DialogModule,ConfirmDialogModule
  ],
  providers: [Service, MessageService,ConfirmationService],
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.scss']
})
export class ManageStudentsComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;

  students!: Student[];
  selectedStudents: Student[] = [];
  selectedStudent: Student | null = null;
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
  showEditDialog(student: Student): void {
    this.selectedStudent = student;
    this.dialogVisible = true;
  }

  onDialogClose(updatedStudent: Student | null): void {
    if (updatedStudent) {
      const index = this.students.findIndex(s => s.id === updatedStudent.id);
      if (index !== -1) {
        this.students[index] = updatedStudent;
      }
    }
    this.selectedStudent = null;
    this.dialogVisible = false;
  }
  deleteStudents(student: Student): void {
    // Save the current page index
    const currentPage = this.table.first / this.table.rows;
    
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this student?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteStudents(student.id).subscribe(
          () => {
            this.students = this.students.filter(s => s.id !== student.id); // Corrected from this.student to this.students
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Student deleted successfully'
            });
            
            // Restore the page index
            this.table.first = currentPage * this.table.rows;
          },
          error => {
            console.error('Error deleting student', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete student'
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
    { name: 'Cultural Events', key: 'culturalevents' },
    { name: 'Accommodation', key: 'accomodations' },
    { name: 'Courses', key: 'courses' }
  ];


navigateToMemberPage(option: { name: string, key: string }, studentId: string) {
  this.navigationService.setSelectedId(studentId);
  localStorage.setItem('refreshPage', 'true');
  this.router.navigate([`/${option.key}`], { queryParams: { Student_Id: studentId } });
}


ngOnInit(): void {
  const eventid = this.route.snapshot.queryParamMap.get('eventId');
  const accomodationid = this.route.snapshot.queryParamMap.get('accomodationId');
  const courseid = this.route.snapshot.queryParamMap.get('courseId');

  if (eventid) {
    this.fetchStudentEvents(Number(eventid));
  } else if (accomodationid){
    this.fetchStudentAccomodations(Number(accomodationid));
  } else if (courseid){
    this.fetchStudentCourse(Number(courseid));
  }else {
    this.fetchAllData();
  }
}

private async fetchData(apiCall: () => Promise<any>, type: string) {
  this.loading = true;
  try {
    const response = await apiCall();
    console.log(`Fetched Data (${type}):`, response); // Log the response
    this.students = response.map(item => item.studentDetails);
  } catch (error) {
    console.error(`Error fetching ${type}`, error);
  } finally {
    this.loading = false;
  }
}

fetchStudentEvents(id: number) {
  this.fetchData(() => this.service.getStudentEvents({ Id: id, type: 'event' }), 'student events');
}

fetchStudentAccomodations(id: number) {
  this.fetchData(() => this.service.getStudentAccomodation({ Id: id, type: 'accomodation' }), 'student accommodations');
}
fetchStudentCourse(id: number) {
  this.fetchData(() => this.service.getStudentCourse({ Id: id, type: 'course' }), 'student course');
}

fetchAllData() {
  this.loading = true;
  this.service.getStudents().then((students) => {
    this.students = students;
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
    this.selectedStudents = [];
  }
  
  downloadAllStudents(format: string) {
    const data = this.students.map(student => this.mapCustomerToExportFormat(student));
    this.download1(format, data, 'students');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedStudents.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one student.'
        });
      } else {
        const data = this.selectedStudents.map(student => this.mapCustomerToExportFormat(student));
        this.download2(this.downloadComponent.format, data, 'selected_students');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected students called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(student: Student) {
    return {
      ID: student.id,
      'Profile image':student.imageUrl,
      'First Name': student.fname,
      'Last Name': student.lname,
      Email: student.email,
      'Date of Birth': student.dob,
      Address: student.address,
      Gender: student.gender,
      'Blood Group': student.bloodGroup,
      'Dietary Preference': student.dietaryPreference,
      'Emergency Contact Name': student.emergencyContactName,
      'Emergency Contact Number': student.emergencyContactNumber,
      'Emergency Contact Relation': student.emergencyContactRelation
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
      const rows = this.students.map(student => Object.keys(this.exportHeaderMapping).map(key => student[key]));

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
      const rows = this.selectedStudents.map(student => Object.keys(this.exportHeaderMapping).map(key => student[key]));

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

filterByUserId(id: string) {
  const userIdNumber = Number(id);
  if (!isNaN(userIdNumber)) {
    this.students = this.students.filter(student => student.id === userIdNumber);
  } else {
    console.warn('The provided userId is not a valid number.');
  }
}
}
