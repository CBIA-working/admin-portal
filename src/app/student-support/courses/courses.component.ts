import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
import { Courses } from '../domain/schema';
import { DownloadComponent } from '../download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavigationService } from '../service/navigation.service';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    DownloadComponent, ToastModule, FormsModule, OverlayPanelModule, InputGroupModule, 
    InputGroupAddonModule, ChipsModule
  ],
  providers: [Service, MessageService],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;

  courses: Courses[] = [];
  selectedCourses: Courses[] = [];
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;

  exportHeaderMapping = {
    id: 'ID',
    title: 'Title',
    description: 'Description',
    startDate: 'Start Date',
    endDate: 'End Date',
    keyDates: 'Key Dates',
    events: 'Events',
    agreements: 'Agreements',
  };

  constructor(
    private route: ActivatedRoute,
    private service: Service,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private router: Router
  ) {}

  options = [
    { name: 'Students', key: 'managestudent' },
  ];

  navigateToMemberPage(option: { name: string, key: string }, id: string) {
    this.navigationService.setSelectedId(id);
    localStorage.setItem('refreshPage', 'true');
    this.router.navigate([`/${option.key}`], { queryParams: { courseId: id } });
  }

  ngOnInit(): void {
    const studentId = this.route.snapshot.queryParamMap.get('Student_Id');
    if (studentId) {
      this.fetchStudentAccommodations(Number(studentId));
    } else {
      this.fetchAllAccommodations();
    }
  }

  fetchStudentAccommodations(studentId: number) {
    this.loading = true;
    this.service.getStudentCourse({ Id: studentId, type: 'student' }).then((response) => {
      this.courses = response.map(item => item.courseDetails);
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching student events', error);
      this.loading = false;
    });
  }

  fetchAllAccommodations() {
    this.loading = true;
    this.service.getCourse().then((courses) => {
      this.courses = courses;
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
    this.selectedCourses = [];
  }

  downloadAllStudents(format: string) {
    const data = this.courses.map(courses => this.mapCustomerToExportFormat(courses));
    this.download(format, data, 'courses');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedCourses.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one course.'
        });
      } else {
        const data = this.selectedCourses.map(courses => this.mapCustomerToExportFormat(courses));
        this.download(this.downloadComponent.format, data, 'selected_courses');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected courses called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(course: Courses) {
    return {
      ID: course.id,
      Title: course.title,
      Description: course.description,
      'Start Date': course.startDate,
      'End Date': course.endDate,
      'Key Dates': course.keyDates,
      Events: course.events,
      Agreements: course.agreements
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