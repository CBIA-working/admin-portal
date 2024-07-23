import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service } from '../../service/service';
import { KeyProgramDate } from '../../domain/schema';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-addkeyprogramdate',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, CalendarModule, ToastModule],
  providers: [Service, MessageService],
  templateUrl: './addkeyprogramdate.component.html',
  styleUrls: ['./addkeyprogramdate.component.scss']
})
export class AddKeyProgramDateComponent implements OnInit {
  @Output() submitSuccess = new EventEmitter<void>();

  keyProgramDate: KeyProgramDate = {
    id: 0,
    name: '',
    date: new Date(),
    time: '',
    description: ''
  };
  time: Date = new Date(); // Separate time field

  constructor(private service: Service, private messageService: MessageService) {}

  ngOnInit() {}

  addKeyProgramDate(): void {
    const localDate = new Date(this.keyProgramDate.date); // Date part
    const localTime = new Date(this.time); // Time part, directly taken as local
  
    // Constructing the date-time using local date and local time parts
    let combinedDateTime = new Date(
      localDate.getFullYear(), localDate.getMonth(), localDate.getDate(),
      localTime.getHours(), localTime.getMinutes()
    );
  
    // Convert combined date-time to an ISO string
    let dateTimeString = combinedDateTime.toISOString();
  
    // Extract the time part in HH:mm format
    let timeString = localTime.toTimeString().slice(0, 5);
  
    // Update the keyProgramDate object
    const keyProgramDateWithTime: KeyProgramDate = {
      ...this.keyProgramDate,
      time: timeString
    };
  
    console.log("Final Data being sent:", keyProgramDateWithTime);
  
    this.service.addKeyProgramDates(keyProgramDateWithTime).subscribe(() => {
      // Show success message
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Key Program Date added successfully', life: 1500});
      
      // Reset the form and close the dialog after 3000 milliseconds
      setTimeout(() => {
        this.resetForm();
        this.submitSuccess.emit(); // Notify parent component of success
      }, 3000);
    }, error => {
      console.error('Failed to add key program date:', error);
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to add Key Program Date', life: 1500});
    });
  }
  

  resetForm(): void {
    this.keyProgramDate = {
      id: 0,
      name: '',
      date: new Date(),
      time: '',
      description: ''
    };
    this.time = new Date(); // Reset time to current time
  }
}
