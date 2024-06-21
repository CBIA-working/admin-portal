import { Component, ViewChild } from '@angular/core';
import { Sidebar } from 'primeng/sidebar';
import { ImportsModule } from '../imports';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ImportsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

      @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  
      closeCallback(e): void {
          this.sidebarRef.close(e);
      }
  
      sidebarVisible: boolean = false;
  }
