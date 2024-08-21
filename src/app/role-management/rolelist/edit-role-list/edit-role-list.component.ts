import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Service } from 'src/app/student-support/service/service';
import { Role, Permission } from 'src/app/student-support/domain/schema';
import { NavigationsService } from 'src/app/student-support/service/navigations.service';

@Component({
  selector: 'app-edit-role-list',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    TabViewModule,
    FormsModule,
    DialogModule,
    HttpClientModule,
    CommonModule,
    ToastModule,
    CheckboxModule
  ],
  providers: [MessageService, Service, DatePipe],
  templateUrl: './edit-role-list.component.html',
  styleUrl: './edit-role-list.component.scss'
})
export class EditRoleListComponent implements OnInit, OnChanges {
  @Input() role: Role | null = null;
  @Output() dialogClose: EventEmitter<Role | null> = new EventEmitter<Role | null>();

  originalRole: Role | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;
  pages: any[] = [];

  constructor(
    private service: Service,
    private messageService: MessageService,
    private navigationService: NavigationsService, // Inject the service
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.role && changes.role.currentValue) {
      this.initializePages();
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    if (this.role) {
      this.originalRole = { ...this.role };
      this.initializePages();
    }
  }

  initializePages(): void {
    const allPages = this.navigationService.getPages();
    this.pages = allPages.map(page => {
      const permission = this.role.permissions.find(p => p.pageName === page.title);
      return {
        id: permission ? permission.id : null,
        pageName: page.title,
        read: permission ? permission.type === 'read' || permission.type === 'both' : false,
        write: permission ? permission.type === 'write' || permission.type === 'both' : false,
        both: permission ? permission.type === 'both' : false
      };
    });
  }

  onPermissionChange(pageName: string, permissionType: string, isChecked: boolean): void {
    const page = this.pages.find(p => p.pageName === pageName);
    if (page) {
      if (permissionType === 'read') {
        page.read = isChecked;
        if (!isChecked) {
          page.both = false;
        }
      } else if (permissionType === 'write') {
        page.write = isChecked;
        if (!isChecked) {
          page.both = false;
        }
      } else if (permissionType === 'both') {
        page.both = isChecked;
        if (isChecked) {
          page.read = true;
          page.write = true;
        } else {
          page.read = false;
          page.write = false;
        }
      }

      if (page.read && page.write) {
        page.type = 'both';
      } else if (page.read) {
        page.type = 'read';
      } else if (page.write) {
        page.type = 'write';
      } else {
        page.type = ''; // No permission selected
      }
    }
    this.checkForChanges();
  }

  checkForChanges(): void {
    this.showSaveButton = JSON.stringify(this.pages) !== JSON.stringify(this.role.permissions);
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }

    if (this.role) {
      this.role.permissions = this.pages
        .filter(page => page.read || page.write || page.both)
        .map(page => ({
          id: page.id,
          pageName: page.pageName,
          type: page.both ? 'both' : page.read && page.write ? 'both' : page.read ? 'read' : 'write'
        }));
      this.saveSubscription = this.service.getupdateRoles(this.role)
        .subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Role Updated', detail: 'Changes applied successfully.' });
          setTimeout(() => {
            this.dialogClose.emit(this.role);
          }, 1000);
        }, error => {
          console.error('Error updating role:', error);
        });
    }
  }

  closeDialog(): void {
    this.dialogClose.emit(null);
  }
}