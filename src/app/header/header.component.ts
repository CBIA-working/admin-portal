import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { Service } from '../student-support/service/service'; // Ensure correct path

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, SidebarComponent, BreadcrumbModule, AvatarModule],
  providers: [Service],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };
  user: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private service: Service,
    private route: ActivatedRoute,
    private zone: NgZone  // For manually triggering Angular change detection
  ) {}

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user')!);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route)
    ).subscribe(event => {
      const params = new URLSearchParams(window.location.search);
      const programId = params.get('programId');
      if (programId) {
        this.updateProgramBreadcrumb(programId);
      }
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

    // Add route-specific breadcrumbs
    if (path === '/managestudent') {
      this.items.push({ 
        label: 'Manage Student', 
        escape: false,
        routerLink: '/managestudent',
        command: () => this.reloadPage('/managestudent')
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

  reloadPage(route: string) {
    // Navigate to the route and force reload
    this.router.navigate([route]).then(() => {
      window.location.reload();
    });
  }
}
