import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NavigationsService {
  private pages = [
    { path: '/home', title: 'Home', icon: 'pi pi-home' },
    { path: '/portalUser', title: 'Portal User', icon: 'fa fa-user-circle' },
    { path: '/assignedStudents', title: 'Assigned Students', icon: 'fa fa-users' },
    {
      title: 'Roles',
      icon: 'pi pi-shield',
      children: [
        { path: '/roles', title: 'Add Role', icon: 'fa fa-shield' }, 
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

  private permissions: any[] = [];

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      // Logic to close sidebar can be placed here if needed
    });
    this.loadPermissionsFromSession();
  }

  setPermissions(permissions: any[]): void {
    this.permissions = permissions;
    sessionStorage.setItem('permissions', JSON.stringify(permissions));
  }

  private loadPermissionsFromSession(): void {
    const savedPermissions = sessionStorage.getItem('permissions');
    if (savedPermissions) {
      this.permissions = JSON.parse(savedPermissions);
    }
  }

  hasReadPermission(pageName: string): boolean {
    const permission = this.permissions.find(p => p.pageName === pageName);
    return permission && permission.type === 'read';
  }

  hasWritePermission(pageName: string): boolean {
    const permission = this.permissions.find(p => p.pageName === pageName);
    return permission && (permission.type === 'both' || permission.type === 'write');
  }

  getPages() {
    return this.filterPagesWithPermissions(this.pages);
  }

  private filterPagesWithPermissions(pages: any[]): any[] {
    return pages
      .map(page => {
        if (this.hasPermissionForPage(page.title)) {
          // If the main page has permission, grant access to its children
          if (page.children) {
            return { ...page, children: page.children }; // Automatically include all children
          }
          return page;
        }
        return null;
      })
      .filter(page => page !== null);
  }

  private hasPermissionForPage(pageName: string): boolean {
    return this.permissions.some(permission => permission.pageName === pageName);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
