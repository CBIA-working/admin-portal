
import { NgModule } from '@angular/core';
import { RouterModule,Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ManageStudentsComponent } from './student-support/manage-students/manage-students.component';
import { StudentServicesComponent } from './student-support/student-services/student-services.component';


export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'managestudent', component:ManageStudentsComponent},
  { path: 'studentservice', component:StudentServicesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
]
