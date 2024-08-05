import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { filter } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, SidebarComponent, BreadcrumbModule, AvatarModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };
  user: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
    // Initialize breadcrumb items based on current route
    this.updateBreadcrumbs(this.router.url);

    // Update breadcrumb items dynamically on route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumbs(event.urlAfterRedirects);
      }
    });
  }

  logout() {
    this.authService.clearToken(); // Clear token using AuthService
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  updateBreadcrumbs(url: string) {
    // Reset breadcrumbs
    this.items = [];

    // Extract the path part of the URL
    const path = url.split('?')[0]; // Remove query parameters

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
    else if (path === '/trips') {
      this.items.push({ 
        label: 'Trips', 
        escape: false, 
        routerLink: '/trips',
        command: () => this.reloadPage('/trips')
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

  reloadPage(route: string) {
    // Navigate to the route and force reload
    this.router.navigate([route]).then(() => {
      window.location.reload();
    });
  }
}
