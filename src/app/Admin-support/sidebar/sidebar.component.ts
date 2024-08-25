import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { ImportsModule } from '../../imports';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { filter } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';
import { NavigationsService } from '../../student-support/service/navigations.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ImportsModule, RouterLink, HomeComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {
  sidebarVisible: boolean = false;
  user: any;
  expandedMenu: string | null = null;  // Track the expanded menu

  constructor(private router: Router, private authService: AuthService, private navService: NavigationsService) {}

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
  }

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.sidebarVisible) {
        this.closeSidebar();
      }
    });
  }

  closeSidebar(): void {
    this.sidebarVisible = false;
  }

  toggleMenu(title: string): void {
    this.expandedMenu = this.expandedMenu === title ? null : title;  // Toggle expansion
  }

  logout(): void {
    this.authService.clearToken();
    this.navService.navigateTo('/login');
  }

  handleRouteClick(route: string): void {
    this.closeSidebar();
    this.router.navigate([route]).then(() => {
      window.location.reload();
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isExpanded(title: string): boolean {
    return this.expandedMenu === title;
  }
}
