
import { NgModule } from '@angular/core';
import { RouterModule,Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ManageStudentsComponent } from './student-support/manage-students/manage-students.component';
import { StudentServicesComponent } from './student-support/student-services/student-services.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';


export const routes: Routes = [
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
  { path: 'managestudent', component:ManageStudentsComponent,canActivate: [AuthGuard]},
  { path: 'studentservice', component:StudentServicesComponent,canActivate: [AuthGuard]},
  { path: 'login', component:LoginComponent},
  { path: '**', redirectTo: '/login', pathMatch: 'full' } // Redirect any unknown route to auth
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
]
