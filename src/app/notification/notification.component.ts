import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Service } from '../student-support/service/service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule
  ],
  templateUrl: './notification.component.html',
  providers: [MessageService,Service]
})
export class NotificationComponent {
  emails: string[] = [];
  newEmail = '';
  title = '';
  body = '';
  action1 = '';
  action2 = '';

  constructor(private http: HttpClient, private messageService: MessageService, private service: Service) {}

  addEmail(email: string) {
    if (email && this.emails.indexOf(email) === -1) { // Check to prevent duplicate emails
      this.emails.push(email);
      this.newEmail = '';
    }
  }

  removeEmail(index: number) {
    this.emails.splice(index, 1);
  }

  sendNotification() {
    const payload = {
      emails: this.emails,
      title: this.title,
      body: this.body,
      action1: this.action1,
      action2: this.action2
    };

    this.service.sendNotification(payload).subscribe(
      response => {
        this.messageService.add({severity:'success', summary:'Success', detail:'Notification sent successfully!'});
      },
      error => {
        this.messageService.add({severity:'error', summary:'Error', detail:'Failed to send notification.'});
      }
    );
  }
}
