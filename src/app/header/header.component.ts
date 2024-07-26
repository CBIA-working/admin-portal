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
  imports: [RouterModule, CommonModule, SidebarComponent, BreadcrumbModule,AvatarModule],
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
        routerLink: '/managestudent' 
      });
    }
    else if (path === '/Programs') {
      this.items.push({ 
        label: 'Programs', 
        escape: false, 
        routerLink: '/Programs' 
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
    else if (path === '/profile') {
      this.items.push({ 
        label: 'Profile', 
        escape: false, 
        routerLink: '/profile' 
      });
    }    
    else if (path === '/keyprogramdates') {
      this.items.push({ 
        label: 'Key Program Dates', 
        escape: false, 
        routerLink: '/keyprogramdates' 
      });
    }
    else if (path === '/FAQs') {
      this.items.push({ 
        label: 'FAQs', 
        escape: false, 
        routerLink: '/FAQs' 
      });
    }
    // Add more conditions for additional routes as needed
  }
}
