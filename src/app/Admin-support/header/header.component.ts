import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { Service } from '../../student-support/service/service';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule, CommonModule, SidebarComponent, FormsModule, BreadcrumbModule,
    AvatarModule, DialogModule, ListboxModule, OverlayPanelModule
  ],
  providers: [Service],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('op') op: OverlayPanel;
  @ViewChild('triggerButton') triggerButton: ElementRef;
  dialogVisible=false;
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };
  user: any;
  rolesOptions: SelectItem[] = [
    { label: 'Add Roles', value: '/roles' },
    { label: 'Assign Roles', value: '/assign-roles' }
  ];
  selectedRole: string;
  showRolesDialog: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private service: Service,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user')!);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route)
    ).subscribe(() => {
      this.updateBreadcrumbs(window.location.pathname);
    });
  }

  logout() {
    this.authService.clearToken();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  updateBreadcrumbs(url: string) {
    const path = url.split('?')[0];
    this.items = [];

    if (path === '/roles') {
      this.items.push({
        label: 'Role',
        routerLink: '/roles',
        command: () => this.openRolesDialog()
      }, {
        label: 'Add Roles',
        routerLink: '/roles',
        command: () => this.reloadPage('/roles')
      });
    }
    else if (path === '/assign-roles') {
      this.items.push({
        label: 'Role',
        routerLink: '/assign-roles',
       command: () => this.openRolesDialog()
      }, {
        label: 'Assign Roles',
        routerLink: '/assign-roles',
        command: () => this.reloadPage('/assign-roles')
      });
    }
    else if (path === '/managestudent') {
      this.items.push({ 
        label: 'Manage Student', 
        escape: false,
        routerLink: '/managestudent',
        command: () => this.reloadPage('/managestudent')
      });
    }
    else if (path === '/accomodations') {
      this.items.push({ 
        label: 'Accommodations', 
        escape: false, 
        routerLink: '/accomodations',
        command: () => this.reloadPage('/accomodations')
      });
    }
    else if (path === '/Programs') {
      this.items.push({ 
        label: 'Programs', 
        escape: false, 
        routerLink: '/Programs',
        command: () => this.reloadPage('/Programs')
      });
    } 
    else if (path === '/culturalevents') {
      this.items.push({ 
        label: 'Cultural Events', 
        escape: false, 
        routerLink: '/culturalevents',
        command: () => this.reloadPage('/culturalevents')
      });
    } 
    else if (path === '/accomodations') {
      this.items.push({ 
        label: 'Accommodations', 
        escape: false, 
        routerLink: '/accomodations',
        command: () => this.reloadPage('/accomodations')
      });
    }
    else if (path === '/cityHandbook') {
      this.items.push({ 
        label: 'City Handbook', 
        escape: false, 
        routerLink: '/cityHandbook',
        command: () => this.reloadPage('/cityHandbook')
      });
    }
    else if (path === '/OrientationFile') {
      this.items.push({ 
        label: 'Orientation File', 
        escape: false, 
        routerLink: '/OrientationFile',
        command: () => this.reloadPage('/OrientationFile')
      });
    }
    else if (path === '/courses') {
      this.items.push({ 
        label: 'Courses', 
        escape: false, 
        routerLink: '/courses',
        command: () => this.reloadPage('/courses')
      });
    }
    else if (path === '/profile') {
      this.items.push({ 
        label: 'Profile', 
        escape: false, 
        routerLink: '/profile',
        command: () => this.reloadPage('/profile')
      });
    }    
    else if (path === '/keyprogramdates') {
      this.items.push({ 
        label: 'Key Program Dates', 
        escape: false, 
        routerLink: '/keyprogramdates',
        command: () => this.reloadPage('/keyprogramdates')
      });
    }
    else if (path === '/library') {
      this.items.push({ 
        label: 'Library', 
        escape: false, 
        routerLink: '/library',
        command: () => this.reloadPage('/library')
      });
    }
    else if (path === '/roles') {
      this.items.push({ 
        label: 'Roles', 
        escape: false, 
        routerLink: '/roles',
        command: () => this.reloadPage('/roles')
      });
    }
    else if (path === '/librarytable') {
      const queryParams = new URLSearchParams(window.location.search);
      const programId = queryParams.get('programId');
      if (programId) {
        this.updateProgramBreadcrumb(programId);
      } else {
        this.items.push({
          label: 'Library',
          escape: false,
          routerLink: '/librarytable',
          command: () => this.reloadPage('/librarytable')
        });
      }
    }
    else if (path === '/trips') {
      this.items.push({ 
        label: 'Trips', 
        escape: false, 
        routerLink: '/trips',
        command: () => this.reloadPage('/trips')
      });
    }
    else if (path === '/Tasks') {
      this.items.push({ 
        label: 'Tasks', 
        escape: false, 
        routerLink: '/Tasks',
        command: () => this.reloadPage('/Tasks')
      });
    }
    else if (path === '/FAQs') {
      this.items.push({ 
        label: 'FAQs', 
        escape: false, 
        routerLink: '/FAQs',
        command: () => this.reloadPage('/FAQs')
      });
    }
    
    // Add more conditions for additional routes as needed
  }

  updateProgramBreadcrumb(programId: string) {
    this.service.getProgram({ id: programId }).then(program => {
      if (Array.isArray(program)) {
        const programIdNumber = Number(programId); // Convert programId to a number
        const matchingProgram = program.find(p => p.id === programIdNumber);
        if (matchingProgram) {
          this.zone.run(() => {  // Update breadcrumb within Angular's zone
            // Add LibraryTable breadcrumb first
            this.items = [
              { label: 'Library', escape: false, routerLink: '/librarytable', command: () => this.reloadPage('/librarytable') },
              { label: matchingProgram.name, escape: false, routerLink: `/librarytable?programId=${programId}` , command: () => this.reloadPage('/library') }
            ];
          });
        }
      }
    }).catch(error => {
      console.error('Error fetching program:', error);
    });
  }

  onRoleSelect(rolePath: string) {
    this.router.navigate([rolePath]).then(() => {
      this.dialogVisible = false; // Ensure the dialog closes after navigation
    });
  }

  // Updated to open the dialog instead of using the overlay panel
  openRolesDialog() {
    this.showRolesDialog = true;
  }

  closeRolesDialog() {
    this.showRolesDialog = false;
  }
  

  reloadPage(route: string) {
    this.router.navigate([route]).then(() => {
      window.location.reload();
    });
  }
}
