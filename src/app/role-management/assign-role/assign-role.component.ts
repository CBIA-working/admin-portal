import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Service } from 'src/app/student-support/service/service';
import { Role } from 'src/app/student-support/domain/schema';
import { AddAssignRoleComponent } from "./add-assign-role/add-assign-role.component";
import { EditAssignRoleComponent } from "./edit-assign-role/edit-assign-role.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-assign-role',
  standalone: true,
  imports: [
    TableModule, HttpClientModule, CommonModule, ButtonModule,
    ToastModule, FormsModule, DialogModule,ConfirmDialogModule,
    AddAssignRoleComponent, EditAssignRoleComponent
  ],
  providers: [Service, MessageService, ConfirmationService],
  templateUrl: './assign-role.component.html',
  styleUrls: ['./assign-role.component.scss']
})
export class AssignRoleComponent implements OnInit {
  roles: any[] = [];
  loading: boolean = true;
  dialogVisible: boolean = false;
  selectedRole: any = null;
  addDialogVisible: boolean = false;

  constructor(
    private service: Service,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetchRoles();
  }

  fetchRoles(): void {
    this.loading = true;
    this.service.getAdminRoles().then(
      roles => {
        this.roles = roles;
        this.loading = false;
      },
      error => {
        console.error('Failed to fetch roles:', error);
        this.loading = false;
      }
    );
  }

  showAddDialog() {
    this.addDialogVisible = true;
  }

  onAddDialogClose(admin: Role | null): void {
    this.addDialogVisible = false;
    this.fetchRoles(); 
  }

showEditDialog(role: any): void {
    console.log('Selected Role Data:', role);  // Log the selected role data
    
    // Set the selected role data for the dialog
    this.selectedRole = {
        AdminId: role.Admin.id,
        RoleId: role.Role.id,
        RoleName: role.Role.roleName,
        Permissions: role.Role.permissions,
        AdminName: `${role.Admin.fname} ${role.Admin.lname}`
    };

    // Show the dialog
    this.dialogVisible = true;  // Ensure this line is present
}




  onDialogClose(admin: Role | null): void {
    this.dialogVisible = false;
    this.fetchRoles(); // Refresh roles after changes
  }

  clear(table: any): void {
    table.clear();
  }
}
