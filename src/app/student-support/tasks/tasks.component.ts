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
import { DownloadComponent } from '../download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageService, ConfirmationService } from 'primeng/api'; // Import ConfirmationService
import { ToastModule } from 'primeng/toast';
import { NavigationService } from '../service/navigation.service';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Service } from '../service/service';
import { Tasks } from '../domain/schema';
import { TooltipModule } from 'primeng/tooltip';
import { AddTasksComponent } from "./add-tasks/add-tasks.component";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    DownloadComponent, ToastModule, FormsModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule, DialogModule, ConfirmDialogModule, TooltipModule,
    AddTasksComponent
],
  providers: [Service, MessageService, ConfirmationService], // Add ConfirmationService here
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit, AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;

  tasks: Tasks[] = [];
  selectedTask: Tasks[] = [];
  selectedTasks: Tasks | null = null;
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;
  dialogVisible: boolean = false;
  selectedTripId: number | null = null;
  addDialogVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private service: Service,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private router: Router,
    private http: HttpClient,
    private confirmationService: ConfirmationService // Inject ConfirmationService
  ) {}

  showAddDialog() {
    this.addDialogVisible = true;
  }
  onAddDialogClose() {
    this.addDialogVisible = false;
    this.fetchAllTasks();
    // Optionally refresh the student list here
  }
  showEditDialog(tasks: Tasks): void {
    this.selectedTasks = tasks;
    this.dialogVisible = true;
  }
  onDialogClose(updatedTask: Tasks | null): void {
    if (updatedTask) {
      const index = this.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        this.tasks[index] = updatedTask;
      }
    }
    this.selectedTask = null;
    this.dialogVisible = false;
    this.fetchAllTasks();
  }

  deleteTasks(tasks: Tasks): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Task?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteTasks(tasks.id).subscribe(
          () => {
            // Corrected the filtering logic
            this.tasks = this.tasks.filter(t => t.id !== tasks.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Tasks deleted successfully'
            });
            this.fetchAllTasks(); // Fetch the latest list of trips
          },
          error => {
            console.error('Error deleting Tasks', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete Tasks'
            });
          }
        );
      },
      reject: () => {
        // Optionally handle rejection (user clicks cancel)
      }
    });
  }
  
  isBeforeToday(dateString: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time part
    const taskDate = new Date(dateString);
    return taskDate < today;
  }
  
  exportHeaderMapping = {
    id: 'ID',
    name: 'Name',
    Date: 'Date',
    status: 'status',
    FullName:'Full Name',
    StudentId:'Student Id',
  };

  options = [
    { name: 'Students', key: 'managestudent' },
  ];

  navigateToMemberPage(option: { name: string, key: string }, id: string) {
    this.navigationService.setSelectedId(id);
    localStorage.setItem('refreshPage', 'true');
    this.router.navigate([`/${option.key}`], { queryParams: { taskId: id } });
  }

  ngOnInit(): void {
    console.log(this.tasks);

    const studentId = this.route.snapshot.queryParamMap.get('Student_Id');
    if (studentId) {
      this.fetchStudentTasks(Number(studentId));
    } else {
      this.fetchAllTasks();
    }
  }

  fetchStudentTasks(studentId: number) {
    this.loading = true;
    this.service.getStudentTasks({ Id: studentId, type: 'student' }).then((tasks) => {
      this.tasks = tasks.map(tasks => tasks.taskDetails);
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching student tasks', error);
      this.loading = false;
    });
  }

  fetchAllTasks() {
    this.loading = true;
    this.service.getTasks().then((tasks) => {
      this.tasks = tasks;
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching all tasks', error);
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
    this.selectedTask = [];
  }

  downloadAllStudents(format: string) {
    const data = this.tasks.map(tasks => this.mapCustomerToExportFormat(tasks));
    this.download1(format, data, 'tasks');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedTask.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one tasks.'
        });
      } else {
        const data = this.selectedTask.map(tasks => this.mapCustomerToExportFormat(tasks));
        this.download2(this.downloadComponent.format, data, 'selected_tasks');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected tasks called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(tasks: Tasks) {
    return {
      ID: tasks.id,
      'Name': tasks.name,
      'Date': tasks.date,
      'Status': tasks.status,
      'Student Name': tasks.FullName,
      'Student Id': tasks.StudentId,
    };
  }

  download1(format: string, data: any[], filename: string) {
    if (format === 'excel') {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'tasks': worksheet },
        SheetNames: ['tasks']
      };
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
  
      doc.setProperties({
        title: `${filename}`,
        author: 'Your Name',
        creator: 'Your App'
      });

      doc.setFont('helvetica');

      const margin = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      };

      doc.text('tasks List', margin.left, margin.top);
      const columns = Object.values(this.exportHeaderMapping);
      const rows = this.tasks.map(tasks => Object.keys(this.exportHeaderMapping).map(key => tasks[key]));

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
        Sheets: { 'tasks': worksheet },
        SheetNames: ['tasks']
      };
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
  
      doc.setProperties({
        title: `${filename}`,
        author: 'Your Name',
        creator: 'Your App'
      });

      doc.setFont('helvetica');

      const margin = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      };

      doc.text('Students List', margin.left, margin.top);
      const columns = Object.values(this.exportHeaderMapping);
      const rows = this.selectedTask.map(tasks => Object.keys(this.exportHeaderMapping).map(key => tasks[key]));

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

