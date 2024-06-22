import { Component, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { ImportsModule } from '../imports';
import { Router, RouterLink } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ImportsModule,RouterLink,HomeComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private router: Router) {}

      @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  
      closeCallback(e): void {
          this.sidebarRef.close(e);
      }

      isActive(route: string): boolean {
        return this.router.url === route;
      }
      sidebarVisible: boolean = false;
  }
