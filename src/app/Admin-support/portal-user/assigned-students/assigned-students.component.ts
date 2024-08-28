import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { PhoneMessagingComponent } from './phone-messaging/phone-messaging.component';
import { Service } from 'src/app/student-support/service/service';
import { AssignedStudents } from 'src/app/student-support/domain/schema';

interface Message {
  id: number;
  text: string;
  sender: string;
  createdAt: string;
  seen: boolean;
  studentId: number;
}

@Component({
  selector: 'app-assigned-students',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    ToastModule, FormsModule, OverlayPanelModule, DialogModule, ConfirmDialogModule, TooltipModule,
    PhoneMessagingComponent
  ],
  providers: [Service, MessageService, ConfirmationService],
  templateUrl: './assigned-students.component.html',
  styleUrls: ['./assigned-students.component.scss']
})
export class AssignedStudentsComponent implements OnInit {
  assignedStudents: AssignedStudents[] = [];
  loading: boolean = true;
  addassignedStudentsDialogVisible: boolean = false;
  selectedassignedStudents: AssignedStudents | null = null;
  dialogVisible: boolean = false;
  phoneScreenVisible: boolean = false;
  selectedAssignedStudent: AssignedStudents | null = null;
  messages: Message[] = [];
  newMessage: string = '';
  selectedStudentName: string = '';
  unseenMessagesMap: { [studentId: number]: number } = {}; // Track the number of unseen messages for each student

  constructor(
    private service: Service,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetchAssignedStudents();
  }

  fetchAssignedStudents(): void {
    this.loading = true;
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.service.getAssignedStudents().subscribe(
        (data) => {
          this.assignedStudents = data.filter(student => student.Admin.id === parseInt(userId));
          console.log('Filtered assigned students:', this.assignedStudents);
          this.checkForUnseenMessages(); // Check for unseen messages after fetching students
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching assigned students:', error);
          this.loading = false;
        }
      );
    } else {
      console.error('userId not found in local storage');
      this.loading = false;
    }
  }

  checkForUnseenMessages(): void {
    // Iterate through each assigned student and fetch messages
    this.assignedStudents.forEach(assignedStudent => {
      this.service.getMessages(assignedStudent.student.id, assignedStudent.Admin.id).subscribe(
        (messages) => {
          // Count the number of unseen messages from the student
          const unseenMessageCount = messages.filter(msg => msg.sender === 'student' && !msg.seen).length;
          if (unseenMessageCount > 0) {
            this.unseenMessagesMap[assignedStudent.student.id] = unseenMessageCount; // Store the count of unseen messages
          }
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
    });
  }

  getUnseenMessageCount(studentId: number): number {
    return this.unseenMessagesMap[studentId] || 0;
  }

  openPhoneScreen(assignedStudent: AssignedStudents): void {
    this.selectedAssignedStudent = assignedStudent;
    this.selectedStudentName = assignedStudent.student.fname + ' ' + assignedStudent.student.lname;
  
    if (assignedStudent) {
      this.service.getMessages(assignedStudent.student.id, assignedStudent.Admin.id).subscribe(
        (messages) => {
          console.log('Fetched messages:', messages); // Log the fetched messages
  
          this.messages = messages.map(msg => ({
            id: msg.id,
            text: msg.content,
            sender: msg.sender,
            createdAt: msg.createdAt,
            seen: msg.seen,
            studentId: assignedStudent.student.id // Ensure studentId is tracked
          }));
          this.phoneScreenVisible = true;
  
          // Filter messages with seen: false and sender: 'student' and submit their IDs
          const unseenMessageIds = this.messages
            .filter(msg => msg.seen === false && msg.sender === 'student')
            .map(msg => msg.id);
  
          this.updateSeenStatus(unseenMessageIds);
        },
        (error) => {
          console.error('Error fetching messages:', error);
          this.messages = [];
        }
      );
    }
  }
  
  updateSeenStatus(messageIds: number[]): void {
    // Ensure there are valid message IDs to update
    const validMessageIds = messageIds.filter(id => id != null);
    console.log('Unseen message IDs from students to update:', validMessageIds);
  
    if (validMessageIds.length > 0) {
      this.service.updateSeenStatus(validMessageIds).subscribe(
        () => {
          console.log('Seen status updated successfully');
          // Update the local messages to mark them as seen
          this.messages.forEach(msg => {
            if (validMessageIds.includes(msg.id)) {
              msg.seen = true;
            }
          });
          // Clear the unseen status for this student
          if (this.selectedAssignedStudent) {
            this.unseenMessagesMap[this.selectedAssignedStudent.student.id] = 0;
          }
        },
        error => console.error('Failed to update seen status:', error)
      );
    } else {
      console.log('No valid message IDs to update.');
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedAssignedStudent) {
      const messageData = {
        content: this.newMessage,
        studentId: this.selectedAssignedStudent.student.id,
        adminId: this.selectedAssignedStudent.Admin.id,
        sender: 'admin'
      };

      console.log('Posting to API:', `${this.service}/postMessages`, messageData);

      this.service.postMessage(messageData).subscribe(
        (response) => {
          console.log('Message sent successfully', response);
          this.messages.push({
            id: response.data.id, // Assuming the response includes the message ID
            text: this.newMessage,
            sender: 'admin',
            createdAt: new Date().toISOString(),
            seen: true,
            studentId: this.selectedAssignedStudent?.student.id // Ensure studentId is tracked
          });
          this.newMessage = '';
        },
        (error) => {
          console.error('Error sending message', error);
        }
      );
    }
  }

  showEditDialog(assignedStudents: AssignedStudents): void {
    this.selectedassignedStudents = assignedStudents;
    this.dialogVisible = true;
  }

  onDialogClose(updatedAssignedStudents: AssignedStudents | null): void {
    if (updatedAssignedStudents) {
      const index = this.assignedStudents.findIndex(s => s.id === updatedAssignedStudents.id);
      if (index !== -1) {
        this.assignedStudents[index] = updatedAssignedStudents;
      }
    }
    this.selectedassignedStudents = null;
    this.dialogVisible = false;
  }

  showAddRoleDialog(): void {
    this.addassignedStudentsDialogVisible = true;
  }

  onAddRoleDialogClose(): void {
    this.addassignedStudentsDialogVisible = false;
    this.fetchAssignedStudents();
  }

  deleteRole(assignedStudents: AssignedStudents): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this Assigned Students?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteroles(assignedStudents.id).subscribe(
          () => {
            this.assignedStudents = this.assignedStudents.filter(r => r.id !== assignedStudents.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Assigned Students deleted successfully'
            });
          },
          error => {
            console.error('Error deleting Assigned Students', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete Assigned Students'
            });
          }
        );
      },
      reject: () => {
        // Optionally handle rejection
      }
    });
  }

  clear(table: any): void {
    table.clear();
  }
}
