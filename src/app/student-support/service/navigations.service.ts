import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationsService {
  private pages = [
    { path: '/home', title: 'Home', icon: 'pi pi-home' },
    {
      title: 'Roles',
      icon: 'pi pi-shield',
      children: [
        { path: '/roles', title: 'Role', icon: 'fa fa-shield' }, 
        { path: '/assign-roles', title: 'Assign Role', icon: 'fa fa-user-cog' }
      ]
    },
    { path: '/managestudent', title: 'Manage Students', icon: 'pi pi-users' },
    { path: '/Programs', title: 'Programs', icon: 'fa fa-graduation-cap' },
    { path: '/culturalevents', title: 'Cultural Events', icon: 'fa fa-calendar-alt' },
    { path: '/accomodations', title: 'Accommodations', icon: 'pi pi-building' },
    { path: '/cityHandbook', title: 'City Handbook', icon: 'pi pi-map' },
    { path: '/OrientationFile', title: 'Orientation File', icon: 'fa fa-chalkboard-teacher' },
    { path: '/courses', title: 'Courses', icon: 'pi pi-book' },
    { path: '/Tasks', title: 'Tasks', icon: 'pi pi-list-check' },
    { path: '/keyprogramdates', title: 'Key Program Dates', icon: 'fa fa-calendar-check' },
    { path: '/library', title: 'Library', icon: 'pi pi-book' },
    { path: '/trips', title: 'Trips', icon: 'fa fa-plane' },
    { path: '/FAQs', title: 'FAQs', icon: 'pi pi-question-circle' },
    { path: '/settings', title: 'Settings', icon: 'pi pi-cog' }
  ];

  private permissions: any[] = [];  // Store permissions here

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      // Logic to close sidebar can be placed here if needed
    });
  }

  setPermissions(permissions: any[]): void {
    this.permissions = permissions;
  }

  getPages() {
    // Filter pages based on permissions
    return this.pages.filter(page => {
      return this.hasPermissionForPage(page.title);
    });
  }

  private hasPermissionForPage(pageName: string): boolean {
    // Check if the user has permissions for the page
    return this.permissions.some(permission => permission.pageName === pageName);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
