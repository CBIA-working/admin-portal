import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { ImportsModule } from '../imports';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { filter } from 'rxjs/operators';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ImportsModule, RouterLink, HomeComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit, OnInit {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  sidebarVisible: boolean = false;
  user: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
  }

  ngAfterViewInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.sidebarVisible) {
          this.sidebarRef.hide();
          this.sidebarVisible = false;
        }
      });
  }

  closeSidebar() {
    this.sidebarRef.hide();
    this.sidebarVisible = false;
  }

  handleRouteClick(route: string): void {
    // Close the sidebar
    this.closeSidebar();

    // Reload the page
    this.router.navigate([route]).then(() => {
      window.location.reload();
    });
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    this.authService.clearToken();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  getAvatarUrl(gender: string): string {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'path_to_male_avatar';
      case 'female':
        return 'path_to_female_avatar';
      default:
        return 'path_to_default_avatar';
    }
  }
}