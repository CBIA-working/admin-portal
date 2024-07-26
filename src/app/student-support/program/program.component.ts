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
import { Service } from '../service/service';
import { Program } from '../domain/schema';
import { DownloadComponent } from '../download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageService,ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavigationService } from '../service/navigation.service';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-program',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    DownloadComponent, ToastModule, FormsModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule,DialogModule,ConfirmDialogModule,

],
  providers: [Service, MessageService,ConfirmationService,DatePipe],
  templateUrl: './program.component.html',
  styleUrl: './program.component.scss'
})
export class ProgramComponent implements OnInit,AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;

  program: Program[] = [];
  selectedprogram: Program[] = [];
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;
  dialogVisible: boolean = false;
  currentUser: any = {};
  assignDialogVisible: boolean = false;
  selectedCourseId: number | null = null;
  addDialogVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private service: Service,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private router: Router,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe
  ) {}

  showAddDialog() {
    this.addDialogVisible = true;
  }
  onAddDialogClose() {
    this.addDialogVisible = false;
    // Optionally refresh the student list here
  }
  showAssignDialog(courseId: number) {
    this.selectedCourseId = courseId;
    this.assignDialogVisible = true;
  }

  onAssignDialogClose() {
    this.selectedCourseId = null;
    this.assignDialogVisible = false;
  }
  // showEditDialog(program: Program): void {
  //   this.selectedprogram = program;
  //   this.dialogVisible = true;
  // }
  // onDialogClose(updatedCourses: Courses | null): void {
  //   if (updatedCourses) {
  //     const index = this.courses.findIndex(s => s.id === updatedCourses.id);
  //     if (index !== -1) {
  //       this.courses[index] = updatedCourses;
  //     }
  //   }
  //   this.selectedCourse = null;
  //   this.dialogVisible = false;
  // }

  // deleteCulturalEvent(courses: Courses): void {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete this course?',
  //     header: 'Confirm',
  //     icon: 'pi pi-info-circle',
  //     accept: () => {
  //       this.service.deleteCourse(courses.id).subscribe(
  //         () => {
  //           this.courses = this.courses.filter(courses => courses.id !== courses.id);
  //           this.messageService.add({
  //             severity: 'success',
  //             summary: 'Success',
  //             detail: 'Cultural event deleted successfully'
  //           });
  //         },
  //         error => {
  //           console.error('Error deleting course', error);
  //           this.messageService.add({
  //             severity: 'error',
  //             summary: 'Error',
  //             detail: 'Failed to delete courses'
  //           });
  //         }
  //       );
  //     },
  //     reject: () => {
  //       // Optionally handle rejection (user clicks cancel)
  //     }
  //   });
  // }
  exportHeaderMapping = {
    id: 'ID',
    name: 'Name',
    batch: 'Batch',
  };

  options = [
    { name: 'Students', key: 'managestudent' },
    { name: 'Courses', key: 'courses' }
  ];

  navigateToMemberPage(option: { name: string, key: string }, id: string) {
    this.navigationService.setSelectedId(id);
    localStorage.setItem('refreshPage', 'true');
    this.router.navigate([`/${option.key}`], { queryParams: { programId: id } });
  }

  ngOnInit(): void {
    const studentId = this.route.snapshot.queryParamMap.get('Student_Id');
    const courseid = this.route.snapshot.queryParamMap.get('courseId');
    if (studentId) {
      this.fetchStudentPrograms(Number(studentId));
    }else if (courseid){
      this.fetchCoursePrograms(Number(courseid));
    } else {
      this.fetchAllPrograms();
    }
  }

  fetchStudentPrograms(studentId: number) {
    this.loading = true;
    this.service.getStudentProgram({ Id: studentId, type: 'student' }).then((response) => {
      this.program = response.map(item => item.programDetails);
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching student program', error);
      this.loading = false;
    });
  }
  fetchCoursePrograms(courseId: number) {
    this.loading = true;
    this.service.getCourseProgram({ Id: courseId, type: 'course' }).then((response) => {
      this.program = response.map(item => item.programDetails);
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching  program', error);
      this.loading = false;
    });
  }

  fetchAllPrograms() {
    this.loading = true;
    this.service.getProgram().then((program) => {
      this.program = program;
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching all programs', error);
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
    this.selectedprogram = [];
  }

  downloadAllStudents(format: string) {
    const data = this.program.map(courses => this.mapCustomerToExportFormat(courses));
    this.download(format, data, 'courses');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedprogram.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one course.'
        });
      } else {
        const data = this.selectedprogram.map(program => this.mapCustomerToExportFormat(program));
        this.download(this.downloadComponent.format, data, 'selected_courses');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected courses called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(program: Program) {
    return {
      ID: program.id,
      Name: program.name,
      Batch: program.batch,
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

  // filterByUserId(userId: string) {
  //   const userIdNumber = Number(userId);
  //   if (!isNaN(userIdNumber)) {
  //     this.courses = this.courses.filter(course => course.Id === userIdNumber);
  //   } else {
  //     console.warn('The provided userId is not a valid number.');
  //   }
  // }
}