
import { NgModule } from '@angular/core';
import { RouterModule,Routes} from '@angular/router';
import { HomeComponent } from './Admin-support/home/home.component';
import { ManageStudentsComponent } from './student-support/manage-students/manage-students.component';
// import { StudentServicesComponent } from './student-support/student-services/student-services.component';
import { LoginComponent } from './Admin-support/login/login.component';
import { AuthGuard } from './Admin-support/authentication/auth.guard';
import { SettingsComponent } from './Admin-support/settings/settings.component';
import { CulturalEventsComponent } from './student-support/cultural-events/cultural-events.component';
import { AccomodationComponent } from './student-support/accomodation/accomodation.component';
import { CoursesComponent } from './student-support/courses/courses.component';
import { ProfileComponent } from './Admin-support/profile/profile.component';
import { KeyprogramdatesComponent } from './student-support/keyprogramdates/keyprogramdates.component';
import { FaqComponent } from './faq/faq.component';
import { ProgramComponent } from './student-support/program/program.component';
import { TripsComponent } from './student-support/trips/trips.component';
import { CityHandbookComponent } from './student-support/city-handbook/city-handbook.component';
import { OrientationFilesComponent } from './student-support/orientation-files/orientation-files.component';
import { LibraryComponent } from './student-support/library/library.component';
import { LibrarytableComponent } from './student-support/library/librarytable/librarytable.component';
import { TasksComponent } from './student-support/tasks/tasks.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { AssignRoleComponent } from './role-management/assign-role/assign-role.component';
import { PortalUserComponent } from './Admin-support/portal-user/portal-user.component';
import { AssignedStudentsComponent } from './Admin-support/portal-user/assigned-students/assigned-students.component';
import { NotificationComponent } from './notification/notification.component';

export const routes: Routes = [
  { path: 'login', component:LoginComponent},
  { path: 'portalUser', component: PortalUserComponent,canActivate: [AuthGuard] },
  { path: 'assignedStudents', component: AssignedStudentsComponent,canActivate: [AuthGuard] },
  { path: 'notification', component: NotificationComponent,canActivate: [AuthGuard] },
  { path: 'roles', component: RoleManagementComponent,canActivate: [AuthGuard] },
  { path: 'assign-roles', component: AssignRoleComponent,canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
  { path: 'managestudent', component:ManageStudentsComponent,canActivate: [AuthGuard]},
  { path: 'Programs', component:ProgramComponent,canActivate: [AuthGuard]},
  { path: 'courses', component:CoursesComponent,canActivate: [AuthGuard]},
  { path: 'culturalevents', component:CulturalEventsComponent,canActivate: [AuthGuard]},
  { path: 'accomodations', component:AccomodationComponent,canActivate: [AuthGuard]},
  { path: 'Tasks', component:TasksComponent,canActivate: [AuthGuard]},
  { path: 'cityHandbook', component:CityHandbookComponent,canActivate: [AuthGuard]},
  { path: 'OrientationFile', component:OrientationFilesComponent,canActivate: [AuthGuard]},
  { path: 'keyprogramdates',component:KeyprogramdatesComponent,canActivate:[AuthGuard]},
  { path: 'library', component:LibraryComponent,canActivate: [AuthGuard]},
  { path: 'librarytable', component:LibrarytableComponent,canActivate: [AuthGuard]},
  { path: 'trips', component:TripsComponent,canActivate: [AuthGuard]},
  { path: 'FAQs', component:FaqComponent,canActivate: [AuthGuard]},
  { path: 'profile', component:ProfileComponent,canActivate: [AuthGuard]},
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
