import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Service } from 'src/app/student-support/service/service'; // Import your service

@Component({
  selector: 'app-phone-messaging',
  standalone: true,
  imports: [DialogModule, CommonModule, FormsModule, ButtonModule],
  templateUrl: './phone-messaging.component.html',
  styleUrls: ['./phone-messaging.component.scss']
})
export class PhoneMessagingComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() messages: { text: string; sender: string; createdAt: string }[] = [];
  @Input() studentId!: number; // Expect the studentId to be passed from parent
  @Input() adminId!: number;   // Expect the adminId to be passed from parent

  newMessage: string = '';

  constructor(private service: Service) {} // Inject the service

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const messageData = {
        content: this.newMessage,
        studentId: this.studentId,
        adminId: this.adminId,
        sender: 'admin' // or 'student' based on context
      };

      // Log the message data being sent
      console.log('Message data being sent to API:', messageData);

      // Post the message to the API
      this.service.postMessage(messageData).subscribe(
        (response) => {
          console.log('Message sent successfully', response);

          // Add the new message to the local messages array to update the UI
          this.messages.push({
            text: this.newMessage,
            sender: messageData.sender,
            createdAt: new Date().toISOString()
          });

          // Clear the input field after sending the message
          this.newMessage = '';

          // Log the updated messages array
          console.log('Updated messages array:', this.messages);
        },
        (error) => {
          console.error('Error sending message to API', error);
        }
      );
    } else {
      console.log('No message to send.');
    }
  }

  isSameDate(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  closeDialog(): void {
    this.visibleChange.emit(false);
  }
}
