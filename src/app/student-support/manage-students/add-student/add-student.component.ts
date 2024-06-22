import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ImportsModule } from 'src/app/imports';
@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [
      StepperModule,
      ButtonModule,
      InputTextModule,
      ToggleButtonModule,
      IconFieldModule,
      InputIconModule,
      CommonModule,ImportsModule
    ],
    providers: [ConfirmationService, MessageService],
    styles: [
        `.p-stepper {
            flex-basis: 40rem;
        } 
        `
    ],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.scss'
})
export class AddStudentComponent {
  selectedGender: any;
  genders: any[] = [
    { label: 'Male', icon: 'pi pi-mars', value: 'male' },
    { label: 'Female', icon: 'pi pi-venus', value: 'female' },
    { label: 'Other', icon: 'pi pi-genderless', value: 'other' }
  ];
  
  active: number | undefined = 0;

  name: string | undefined = null;

  email: string | undefined = null;

  password: string | undefined = null;

  option1: boolean | undefined = false;

  option2: boolean | undefined = false;

  option3: boolean | undefined = false;

  option4: boolean | undefined = false;

  option5: boolean | undefined = false;

  option6: boolean | undefined = false;

  option7: boolean | undefined = false;

  option8: boolean | undefined = false;

  option9: boolean | undefined = false;

  option10: boolean | undefined = false;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  confirm(event: Event) {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'Please confirm to proceed moving forward.',
          icon: 'pi pi-exclamation-circle',
          acceptIcon: 'pi pi-check mr-1',
          rejectIcon: 'pi pi-times mr-1',
          acceptLabel: 'Confirm',
          rejectLabel: 'Cancel',
          rejectButtonStyleClass: 'p-button-outlined p-button-sm',
          acceptButtonStyleClass: 'p-button-sm',
          accept: () => {
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
          }
      });
  }
}