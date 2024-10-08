import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageService, ConfirmationService } from 'primeng/api'; // Import ConfirmationService
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Service } from 'src/app/student-support/service/service';
import { Role } from 'src/app/student-support/domain/schema';
import { TooltipModule } from 'primeng/tooltip';
import { EditRoleListComponent } from './edit-role-list/edit-role-list.component';

@Component({
  selector: 'app-rolelist',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    ToastModule, FormsModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule, DialogModule, ConfirmDialogModule,TooltipModule,EditRoleListComponent
],
  providers: [Service, MessageService, ConfirmationService],
  templateUrl: './rolelist.component.html',
  styleUrl: './rolelist.component.scss'
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  loading: boolean = true;
  addRoleDialogVisible: boolean = false;
  selectedRole: Role | null = null;
  dialogVisible: boolean = false;

  constructor(
    private service: Service,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  showEditDialog(role: Role): void {
    this.selectedRole = role;
    this.dialogVisible = true;
  }
  onDialogClose(updatedRoles: Role | null): void {
    if (updatedRoles) {
      const index = this.roles.findIndex(s => s.id === updatedRoles.id);
      if (index !== -1) {
        this.roles[index] = updatedRoles;
      }
    }
    this.selectedRole = null;
    this.dialogVisible = false;
  }
  ngOnInit(): void {
    this.fetchRoles();
  }

  fetchRoles(): void {
    this.loading = true;
    this.service.getRoles().subscribe(
      (data) => {
        this.roles = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching roles:', error);
        this.loading = false;
      }
    );
  }

  showAddRoleDialog() {
    this.addRoleDialogVisible = true;
  }

  onAddRoleDialogClose() {
    this.addRoleDialogVisible = false;
    this.fetchRoles(); // Refresh the roles list after adding a role
  }

  deleteRole(role: Role): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this role?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteroles(role.id).subscribe(
          () => {
            this.roles = this.roles.filter(r => r.id !== role.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Role deleted successfully'
            });
          },
          error => {
            console.error('Error deleting role', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete role'
            });
          }
        );
      },
      reject: () => {
        // Optionally handle rejection (user clicks cancel)
      }
    });
  }

  clear(table: any) {
    table.clear();
  }
}