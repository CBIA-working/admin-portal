import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, SidebarComponent, BreadcrumbModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/home' };

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize breadcrumb items based on current route
    this.updateBreadcrumbs(this.router.url);

    // Update breadcrumb items dynamically on route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateBreadcrumbs(event.urlAfterRedirects);
      }
    });
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
        routerLink: '/managestudent' 
      });
    }
     else if (path === '/culturalevents') {
      this.items.push({ 
        label: 'Cultural Events', 
        escape: false, 
        routerLink: '/culturalevents' 
      });
      
    } 
    else if (path === '/accomodations') {
      this.items.push({ 
        label: 'Accomodations', 
        escape: false, 
        routerLink: '/accomodations' 
      });
    }
    else if (path === '/courses') {
      this.items.push({ 
        label: 'Courses', 
        escape: false, 
        routerLink: '/courses' 
      });
    }
    else if (path === '/admin') {
      this.items.push({ label: 'Admin', routerLink: '/admin' });
    }
    // Add more conditions for additional routes as needed
  }
}
