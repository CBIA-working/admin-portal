import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CardModule,
    AvatarModule,
    ButtonModule,
    TabViewModule, // Import TabViewModule here
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user = {
    fname: "Kamakshya",
    lname: "Nanda",
    email: "knanda3001@gmail.com",
    password: "Pass@12",
    dob: "1725-01-17",
    address: "ABC St. XYZ City",
    gender: "Male",
    bloodGroup: "A+",
    dietaryPreference: "Non-Vegetarian",
    emergencyContactName: "John Doe",
    emergencyContactNumber: "9999999999",
    emergencyContactRelation: "Father"
  };
}
