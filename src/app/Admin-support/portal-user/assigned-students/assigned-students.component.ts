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
  phoneScreenVisible: boolean = false; // Controls the visibility of the phone screen dialog
  selectedAssignedStudent: AssignedStudents | null = null;
  messages: { text: string; sender: string; createdAt: string }[] = []; // Array to hold messages
  newMessage: string = ''; // Model for new message input

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
    
    // Retrieve the userId from local storage
    const userId = localStorage.getItem('userId');
    
    // Make sure the userId exists
    if (userId) {
      this.service.getAssignedStudents().subscribe(
        (data) => {
          // Filter the data to only include students assigned to the current admin (user)
          this.assignedStudents = data.filter(student => student.Admin.id === parseInt(userId));
          console.log('Filtered assigned students:', this.assignedStudents);  // Log the filtered data
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

  openPhoneScreen(assignedStudent: AssignedStudents): void {
    this.selectedAssignedStudent = assignedStudent;
  
    // Fetch messages from the API for the selected student and admin
    if (assignedStudent) {
      this.service.getMessages(assignedStudent.student.id, assignedStudent.Admin.id).subscribe(
        (messages) => {
          // Map the messages to include text, sender, and createdAt
          this.messages = messages.map((msg) => ({
            text: msg.content,
            sender: msg.sender, // Include the sender property
            createdAt: msg.createdAt // Include the createdAt property
          }));
          this.phoneScreenVisible = true; // Show the phone messaging dialog
        },
        (error) => {
          console.error('Error fetching messages:', error);
          this.messages = []; // Clear the messages if there's an error
        }
      );
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedAssignedStudent) {
      // Prepare the message data for the API call
      const messageData = {
        content: this.newMessage,
        studentId: this.selectedAssignedStudent.student.id, // Use the selected student's ID
        adminId: this.selectedAssignedStudent.Admin.id, // Use the selected admin's ID
        sender: 'admin' // Replace with 'student' if the sender is a student
      };
  
      // Log the API endpoint and the data being sent
      console.log('Posting to API:', `${this.service}/postMessages`);
      console.log('Message data:', messageData);
  
      // Post the message to the API
      this.service.postMessage(messageData).subscribe(
        (response) => {
          console.log('Message sent successfully', response);
  
          // Add the new message to the local messages array to update the UI
          this.messages.push({
            text: this.newMessage,
            sender: messageData.sender,
            createdAt: new Date().toISOString() // Add the current timestamp
          });
  
          // Clear the input field after sending the message
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

  showAddRoleDialog() {
    this.addassignedStudentsDialogVisible = true;
  }

  onAddRoleDialogClose() {
    this.addassignedStudentsDialogVisible = false;
    this.fetchAssignedStudents(); // Refresh the roles list after adding a role
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
        // Optionally handle rejection (user clicks cancel)
      }
    });
  }

  clear(table: any) {
    table.clear();
  }
}
