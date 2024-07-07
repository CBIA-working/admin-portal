
import { NgModule } from '@angular/core';
import { RouterModule,Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ManageStudentsComponent } from './student-support/manage-students/manage-students.component';
// import { StudentServicesComponent } from './student-support/student-services/student-services.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './authentication/auth.guard';
import { SettingsComponent } from './settings/settings.component';
import { CulturalEventsComponent } from './student-support/cultural-events/cultural-events.component';
import { AccomodationComponent } from './student-support/accomodation/accomodation.component';
import { CoursesComponent } from './student-support/courses/courses.component';
import { ProfileComponent } from './profile/profile.component';


export const routes: Routes = [
  { path: 'login', component:LoginComponent},
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
  { path: 'managestudent', component:ManageStudentsComponent,canActivate: [AuthGuard]},
  { path: 'culturalevents', component:CulturalEventsComponent,canActivate: [AuthGuard]},
  { path: 'accomodations', component:AccomodationComponent,canActivate: [AuthGuard]},
  { path: 'courses', component:CoursesComponent,canActivate: [AuthGuard]},
  { path: 'profile', component:ProfileComponent,canActivate: [AuthGuard]},
  // { path: 'culturalevents/:id', component:CulturalEventsComponent,canActivate: [AuthGuard]},
  // { path: 'studentservice', component:StudentServicesComponent,canActivate: [AuthGuard]},
  { path: 'settings', component:SettingsComponent,canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/login', pathMatch: 'full' } // Redirect any unknown route to auth
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
]
