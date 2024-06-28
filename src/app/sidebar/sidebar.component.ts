import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { ImportsModule } from '../imports';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ImportsModule, RouterLink, HomeComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements AfterViewInit {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  sidebarVisible: boolean = false;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.sidebarRef.close(null);
        this.sidebarVisible = false;
      });
  }

  closeCallback(e: any): void {
    this.sidebarRef.close(e);
    this.sidebarVisible = false;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
