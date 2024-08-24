import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Service } from 'src/app/student-support/service/service';
import { RoleData } from 'src/app/student-support/domain/schema';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-edit-assign-role',
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
      DropdownModule
    ],
  providers: [MessageService, Service, DatePipe],
  templateUrl: './edit-assign-role.component.html',
  styleUrls: ['./edit-assign-role.component.scss'],

})
export class EditAssignRoleComponent implements OnInit, OnChanges {
  @Input() role: RoleData | null = null;
  @Output() dialogClose: EventEmitter<RoleData | null> = new EventEmitter<RoleData | null>();

  originalRoleData: RoleData | null = null;
  showSaveButton: boolean = false;
  saveSubscription: Subscription | null = null;
  selectedFile: File | null = null; // Store the selected file

  roles: any[] = [];  // Store the fetched roles
  selectedPermissions: string[] = []; // Store the permissions for the selected role
  selectedRole: any; // Separate selected role for dropdown

  // other existing properties and methods



  constructor(
    private service: Service,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef  // Inject ChangeDetectorRef for manual change detection
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.role && changes.role.currentValue) {
        this.cdr.detectChanges();  // Manually trigger change detection to update the view
    }
  }
  
  ngOnInit(): void {
    if (this.role) {
      this.originalRoleData = { ...this.role };
      this.selectedRole = this.roles.find(r => r.roleName === this.role.RoleName);
    }
  
    this.getRoles().subscribe(
      roles => {
        this.roles = roles;
        this.selectedRole = roles.find(role => role.roleName === this.role?.RoleName);
        if (this.selectedRole) {
          this.selectedPermissions = this.selectedRole.permissions;
        }
      },
      error => console.error('Error fetching roles:', error)
    );
  }
  

  getRoles(): Observable<any[]> {
    return this.service.getRoles();
  }

  onRoleChange(event: any): void {
    const selectedRole = event.value;
    if (selectedRole) {
      // Update the role object to reflect the change
      this.role.RoleId = selectedRole.id;
      this.role.RoleName = selectedRole.roleName;
      this.role.Permissions = selectedRole.permissions;
      
      this.selectedPermissions = selectedRole.permissions.map(permission => ({
        type: permission.type,
        pageName: permission.pageName
      }));
  
      // Check if the role change should toggle the save button
      this.showSaveButton = this.originalRoleData && this.role.RoleId !== this.originalRoleData.RoleId;
    } else {
      this.selectedPermissions = [];
      this.showSaveButton = false;
    }
    this.cdr.detectChanges();
  }
  
  

  onFieldChange(): void {
    this.checkForChanges();
  }

  checkForChanges(): void {
    if (this.role && this.originalRoleData) {
      const roleCopy = { ...this.role };
      this.showSaveButton = JSON.stringify(roleCopy) !== JSON.stringify(this.originalRoleData);
    }
  }

  saveChanges(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  
    if (this.role) {
  
      this.saveSubscription = this.service.updateAdminRole(this.role)
        .subscribe(response => {
          this.messageService.add({ severity: 'success', summary: 'Assigned Role Updated', detail: 'Will reload to apply the changes.' });
          setTimeout(() => {
            this.dialogClose.emit(this.role); // Emit the updated event object
          }, 1000);
        }, error => {
          console.error('Error updating Assigned Role:', error);
        });
    }
  }
  
  

  closeDialog(): void {
    this.dialogClose.emit(null);
  }
}

  
