import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule,SidebarComponent,BreadcrumbModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent  {
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
      this.items.push({ label: 'Student Support > Manage Student', routerLink: '/managestudent' });
    } 
    if(url === '/studentservice') {
      this.items.push({ label: 'Student Support > Student Service', routerLink: '/studentservice' });
    } 
    else if (url === '/admin') {
      this.items.push({ label: 'Admin', routerLink: '/admin' });
    }
    // Add more conditions for additional routes as needed
  }
}
