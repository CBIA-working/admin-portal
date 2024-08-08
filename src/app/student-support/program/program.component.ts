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
import { EditProgramComponent } from './edit-program/edit-program.component';
import { AddProgramComponent } from "./add-program/add-program.component";
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-program',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    DownloadComponent, ToastModule, FormsModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule, DialogModule, ConfirmDialogModule, TooltipModule,EditProgramComponent,
    AddProgramComponent
],
  providers: [Service, MessageService,ConfirmationService,DatePipe],
  templateUrl: './program.component.html',
  styleUrl: './program.component.scss'
})
export class ProgramComponent implements OnInit,AfterViewInit {
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;

  program: Program[] = [];
  selectedprograms: Program[] = [];
  selectedprogram: Program | null = null;
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;
  dialogVisible: boolean = false;
  addDialogVisible: boolean = false;
  archivedPrograms: Program[] = [];
  archiveDialogVisible: boolean = false;
  totalArchivedPrograms: number = 0;
  showStatusColumn: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private service: Service,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private router: Router,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private datePipe: DatePipe,
  ) {}

  archiveProgram(program: Program): void {
    this.service.archiveProgram(program.id).subscribe(
      (updatedProgram) => {
        this.program = this.program.filter((p) => p.id !== program.id);
        this.archivedPrograms.push(updatedProgram);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Program archived successfully',
        });
      },
      (error) => {
        console.error('Error archiving program', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to archive program',
        });
      }
    );
  }
  loadArchiveDialog(): void{
    this.service.getArchivedPrograms().subscribe(
      (archivedPrograms) => {
        this.archivedPrograms = archivedPrograms;
        this.totalArchivedPrograms = archivedPrograms.length; // Update the count
      },
      (error) => {
        console.error('Error fetching archived programs', error);
      }
    );
  }
  showArchiveDialog(): void {
    this.archiveDialogVisible = true;
   this.loadArchiveDialog();
  }
  
  unarchiveProgram(program: Program): void {
    this.service.unarchiveProgram(program.id).subscribe(
      () => {
        // Remove from archived programs and add back to the main list
        this.archivedPrograms = this.archivedPrograms.filter(p => p.id !== program.id);
        this.program.push(program);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Program unarchived successfully'
        });
      },
      error => {
        console.error('Error unarchiving Program', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to unarchive Program'
        });
      }
    );
  }
  closeArchiveDialog(): void {
    this.archiveDialogVisible = false;
    this.fetchAllPrograms(); // Fetch programs to update the list
  }
  copyProgram(program: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to copy this program?',
      accept: () => {
        this.service.copyProgram(program.id).subscribe(response => {
          this.fetchAllPrograms();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Program copied successfully!' });
          // Handle successful copy (e.g., refresh the program list)
        }, error => {
          // Show error message
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to copy the program.' });
          // Handle error
        });
      }
    });
  }

  showAddDialog() {
    this.addDialogVisible = true;
  }
  onAddDialogClose() {
    this.addDialogVisible = false;
    // Optionally refresh the student list here
  }

  showEditDialog(program: Program): void {
    this.selectedprogram = program;
    this.dialogVisible = true;
  }

  onDialogClose(updatedProgram: Program | null): void {
    if (updatedProgram) {
      this.selectedprogram = updatedProgram;
      // Optionally refresh the program list here if necessary
    }
    this.dialogVisible = false;
  }

  deleteCulturalEvent(program: Program): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Program?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteProgram(program.id).subscribe(
          () => {
            // Optionally call a method to re-fetch programs after deletion
            this.fetchAllPrograms();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Program deleted successfully'
            });
          },
          error => {
            console.error('Error deleting Program', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete Program'
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
    name: 'Name',
    fullForm:'Full Form',
    batch: 'Batch',
  };

  options = [
    { name: 'Students', key: 'managestudent' },
    { name: 'Courses', key: 'courses' },
    { name: 'Library', key: 'librarytable' },
  ];

  navigateToMemberPage(option: { name: string, key: string }, id: string) {
    this.navigationService.setSelectedId(id);
    localStorage.setItem('refreshPage', 'true');
    this.router.navigate([`/${option.key}`], { queryParams: { programId: id } });
  }

  ngOnInit(): void {
    const studentId = this.route.snapshot.queryParamMap.get('Student_Id');
    const courseid = this.route.snapshot.queryParamMap.get('courseId');
    const libraryid = this.route.snapshot.queryParamMap.get('libraryId');
    const source = this.route.snapshot.queryParamMap.get('source');

    if (studentId || courseid || libraryid || source) {
      this.showStatusColumn = true;
    } else {
      this.showStatusColumn = false;
    }

    if (studentId) {
      this.fetchStudentPrograms(Number(studentId));
    }else if (courseid){
      this.fetchCoursePrograms(Number(courseid));
    } else if (libraryid){
      this.fetchLibraryPrograms(Number(libraryid));
    } else {
      this.fetchAllPrograms();
    }
    this.loadArchiveDialog();
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
  fetchLibraryPrograms(libraryId: number) {
    this.loading = true;
    this.service.getLibraryProgram({ Id: libraryId, type: 'library' }).then((response) => {
      this.program = response.map(item => item.programDetails);
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching  program', error);
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
      this.program = program.filter(p => !p.archived); // Exclude archived programs
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
    this.selectedprograms = [];
  }

  downloadAllStudents(format: string) {
    const data = this.program.map(courses => this.mapCustomerToExportFormat(courses));
    this.download(format, data, 'courses');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedprograms.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one course.'
        });
      } else {
        const data = this.selectedprograms.map(program => this.mapCustomerToExportFormat(program));
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
      "Detailed Name":program.fullForm,
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

}