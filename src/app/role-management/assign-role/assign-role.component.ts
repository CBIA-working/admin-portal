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
import { AddAssignRoleComponent } from "./add-assign-role/add-assign-role.component";

@Component({
  selector: 'app-assign-role',
  standalone: true,
  imports: [
    TableModule, RouterModule, HttpClientModule, CommonModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    ToastModule, FormsModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule, DialogModule, ConfirmDialogModule, TooltipModule,
    AddAssignRoleComponent
],
  providers: [Service, MessageService, ConfirmationService],
  templateUrl: './assign-role.component.html',
  styleUrl: './assign-role.component.scss'
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

  showAddDialog() {
    this.addDialogVisible = true;
  }
  onAddDialogClose() {
    this.addDialogVisible = false;
    this.fetchRoles(); 
  }

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

  showEditDialog(role: any): void {
    this.selectedRole = role;
    this.dialogVisible = true;
  }

  onDialogClose(admin: Role | null): void {
    this.dialogVisible = false;
    this.fetchRoles(); // Refresh roles after changes
  }

  // deleteRole(role: any): void {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete this role?',
  //     accept: () => {
  //       this.service.deleteRole(role.id).then(
  //         response => {
  //           this.messageService.add({severity: 'success', summary: 'Success', detail: 'Role deleted successfully'});
  //           this.fetchRoles(); // Refresh list after deletion
  //         },
  //         error => {
  //           this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to delete role'});
  //         }
  //       );
  //     }
  //   });
  // }

  clear(table: any): void {
    table.clear();
  }
}