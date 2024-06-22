import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';

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
        this.updateBreadcrumbs(event.url);
      }
    });
  }

  updateBreadcrumbs(url: string) {
    // Reset breadcrumbs
    this.items = [];

    // Add route-specific breadcrumbs
    if (url === '/managestudent') {
      this.items.push({ 
        label: 'Student Support  <i class="pi pi-angle-right"></i> Manage Student', 
          escape: false,
           routerLink: '/managestudent' 
          });
    } else if (url === '/studentservice') {
      this.items.push({ 
          label: 'Student Support <i class="pi pi-angle-right"></i> Student Service', 
          escape: false, 
          routerLink: '/studentservice' 
      });
  }
   else if (url === '/admin') {
      this.items.push({ label: 'Admin', routerLink: '/admin' });
    }
    // Add more conditions for additional routes as needed
  }
}
