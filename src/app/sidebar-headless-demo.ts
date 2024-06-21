import { Component, ViewChild } from '@angular/core';
import { ImportsModule } from './imports';
import { Sidebar } from 'primeng/sidebar';

@Component({
    selector: 'sidebar-headless-demo',
    templateUrl: './sidebar-headless-demo.html',
    standalone: true,
    imports: [ImportsModule]
})
export class SidebarHeadlessDemo {
    @ViewChild('sidebarRef') sidebarRef!: Sidebar;

    closeCallback(e): void {
        this.sidebarRef.close(e);
    }

    sidebarVisible: boolean = false;
}