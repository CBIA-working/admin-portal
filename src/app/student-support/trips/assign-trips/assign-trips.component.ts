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
  selector: 'app-assign-trips',
  standalone: true,
  imports: [CommonModule, DialogModule, TableModule, ButtonModule, 
    DropdownModule, FormsModule, ToastModule, SkeletonModule],
  templateUrl: './assign-trips.component.html',
  styleUrl: './assign-trips.component.scss',
  providers: [MessageService]
})
export class AssignTripsComponent  implements OnChanges {
  @Input() tripId!: number;
  @Output() dialogClose: EventEmitter<null> = new EventEmitter<null>();
  assignDialogVisible: boolean = false;
  studentDetails: any[] = [];
  studentsList: any[] = []; // To hold the list of students for dropdown
  selectedStudentId: number | null = null;
  skeletonRows = Array(4).fill(0);
  loading: boolean = false;
  
  constructor(
    private service: Service, 
    private messageService: MessageService, 
    private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tripId && this.tripId) {
      this.openDialog();
    }
  }

  async openDialog() {
    if (this.tripId) {
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
      const body = { Id: this.tripId, type: 'trip' };
      const data = await this.service.getStudentTrips(body);
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

  assignTripToStudent() {

    if (this.selectedStudentId && this.tripId) {
      this.service.assignTrip(this.selectedStudentId, this.tripId).subscribe(
        (response) => {
          console.log('Trip assigned successfully', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Assignment Successful',
            detail: `Assigned trip: ${this.tripId} to student id: ${this.selectedStudentId}/${this.getStudentName(this.selectedStudentId)}`
          });
          this.fetchStudentDetails(); // Refresh student details without closing the dialog
          this.selectedStudentId = null;
        },
        (error) => {
          console.error('Error assigning trip', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Assignment Failed',
            detail: 'There was an error assigning the trip. Please try again.'
          });
        }
      );
    } else {
      console.warn('No student selected or trip ID is missing.');
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

  deleteAssignmenttrip(studentId: number) {
    if (this.tripId) {
      this.service.deleteAssignmentTrip(studentId, this.tripId).subscribe(
        (response) => {
          console.log('Assignment deleted successfully', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Deletion Successful',
            detail: `Removed assignment of trip: ${this.tripId} from student id: ${studentId}`
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
      console.warn('Trip ID is missing.');
    }
  }
  
  
}

