import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Service } from '../../service/service'; // Import your service
import { MessageService } from 'primeng/api'; // Import ToastModule and MessageService
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-assign-events',
  standalone: true,
  imports: [CommonModule, DialogModule, TableModule, ButtonModule, DropdownModule, FormsModule, ToastModule, SkeletonModule],
  templateUrl: './assign-events.component.html',
  styleUrls: ['./assign-events.component.scss'],
  providers: [MessageService] // Provide MessageService in the component
})
export class AssignEventsComponent implements OnChanges {
  @Input() eventId!: number;
  @Output() dialogClose: EventEmitter<null> = new EventEmitter<null>();
  assignDialogVisible: boolean = false;
  studentDetails: any[] = [];
  studentsList: any[] = []; // To hold the list of students for dropdown
  selectedStudentId: number | null = null;
  skeletonRows = Array(10).fill(0);

  loading: boolean = false;
  constructor(private service: Service, private messageService: MessageService, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.eventId && this.eventId) {
      this.openDialog();
    }
  }

  async openDialog() {
    if (this.eventId) {
      this.loading = true;
      try {
        await this.fetchStudentDetails();
        await this.fetchStudentsList();
        this.cdr.detectChanges(); // Ensure change detection to reflect dialog state
        this.assignDialogVisible = true;
      } catch (error) {
        console.error('Error opening dialog', error);
      } finally {
        this.loading = false;
      }
    }
  }
  

  async fetchStudentDetails() {
    try {
      const body = { Id: this.eventId, type: 'event' };
      const data = await this.service.getStudentEvents(body);
      this.studentDetails = data.map((item: any) => ({
        id: item.studentDetails.id,
        fname: item.studentDetails.fname,
        lname: item.studentDetails.lname,
        imageUrl: item.studentDetails.imageUrl
      }));
      console.log('Student details fetched:', this.studentDetails);
    } catch (error) {
      console.error('Error fetching student details', error);
    }
  }

  async fetchStudentsList() {
    try {
      const data = await this.service.getStudents();
      const assignedStudentIds = this.studentDetails.map((student: any) => student.id);
      this.studentsList = data
        .filter((student: any) => !assignedStudentIds.includes(student.id))
        .map((student: any) => ({
          id: student.id,
          name: `${student.id}: ${student.fname} ${student.lname}`
        }));
      console.log('Filtered students list fetched:', this.studentsList);
    } catch (error) {
      console.error('Error fetching students list', error);
    }
  }

  assignEventToStudent() {

    if (this.selectedStudentId && this.eventId) {
      this.service.assignEvent(this.selectedStudentId, this.eventId).subscribe(
        (response) => {
          console.log('Event assigned successfully', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Assignment Successful',
            detail: `Assigned cultural event: ${this.eventId} to student id: ${this.selectedStudentId}/${this.getStudentName(this.selectedStudentId)}`
          });
          this.fetchStudentDetails(); // Refresh student details without closing the dialog
        },
        (error) => {
          console.error('Error assigning event', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Assignment Failed',
            detail: 'There was an error assigning the event. Please try again.'
          });
        }
      );
    } else {
      console.warn('No student selected or event ID is missing.');
    }
  }

  closeDialog(): void {
    this.dialogClose.emit(null);
    this.assignDialogVisible = false;
    this.selectedStudentId = null; // Reset the selected student ID
  }
  

  trackById(index: number, student: any): number {
    return student.id;
  }

  getStudentName(studentId: number): string {
    const student = this.studentsList.find(s => s.id === studentId);
    return student ? student.name : '';
  }

  deleteAssignment(studentId: number) {
    if (this.eventId) {
      this.service.deleteAssignment(studentId, this.eventId).subscribe(
        (response) => {
          console.log('Assignment deleted successfully', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Deletion Successful',
            detail: `Removed assignment of cultural event: ${this.eventId} from student id: ${studentId}`
          });
          this.fetchStudentDetails(); // Refresh student details to reflect changes
        },
        (error) => {
          console.error('Error deleting assignment', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Deletion Failed',
            detail: 'There was an error deleting the assignment. Please try again.'
          });
        }
      );
    } else {
      console.warn('Event ID is missing.');
    }
  }
  
  
}
