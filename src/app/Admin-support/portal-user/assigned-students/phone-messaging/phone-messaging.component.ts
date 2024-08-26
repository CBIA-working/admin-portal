import { CommonModule } from '@angular/common';
import { Component, Input, Output,EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-phone-messaging',
  standalone: true,
  imports: [DialogModule,CommonModule,FormsModule,ButtonModule],
  templateUrl: './phone-messaging.component.html',
  styleUrl: './phone-messaging.component.scss'
})
export class PhoneMessagingComponent {
  @Input() visible: boolean = false; // Controls visibility of the dialog
  @Output() visibleChange = new EventEmitter<boolean>(); // Ensure this is typed as EventEmitter<boolean>
  @Input() messages: { text: string }[] = []; // Messages to display

  newMessage: string = ''; // Model for new message input

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage });
      this.newMessage = '';
      // Implement actual message sending logic here
    }
  }

  closeDialog(): void {
    this.visibleChange.emit(false); // Notify parent to close the dialog
  }
}