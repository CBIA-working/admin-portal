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
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>(); 
  @Input() messages: { text: string }[] = []; 

  newMessage: string = ''; 

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage });
      this.newMessage = '';
      
    }
  }

  closeDialog(): void {
    this.visibleChange.emit(false); 
  }
}