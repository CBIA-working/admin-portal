import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnChanges, Output, SimpleChanges, EventEmitter, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Service } from 'src/app/student-support/service/service';
import { MessageService } from 'primeng/api'; // Import ToastModule and MessageService
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-add-assign-role',
  standalone: true,
  imports: [CommonModule, DialogModule, TableModule, 
    ButtonModule, DropdownModule, FormsModule, ToastModule,
     SkeletonModule],
     providers: [MessageService],
  templateUrl: './add-assign-role.component.html',
  styleUrl: './add-assign-role.component.scss'
})


export class AddAssignRoleComponent implements OnInit {
  admins: any[] = [];
  roles: any[] = [];
  selectedAdminIds: (number | null)[] = [null];
  selectedRoleId: number | null = null;
  selectedRoleDetails: any | null = null;
  roleData: any[] = [];
  loading: boolean = true;
  roleSelected: boolean = false;

  constructor(private service: Service, private messageService: MessageService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
      this.fetchAdminsAndRoles();
  }

  async fetchAdminsAndRoles() {
      try {
          this.loading = true;
          const [adminData, roleData] = await Promise.all([
              this.service.getAdmin().then(data => data.map((admin: any) => ({
                  ...admin,
                  label: `${admin.fname} ${admin.lname}`,
                  value: admin.id
              }))),
              this.service.getRoles().toPromise()
          ]);

          this.admins = adminData;
          this.roles = roleData;
          this.loading = false;
      } catch (error) {
          console.error('Error fetching data:', error);
          this.messageService.add({ severity: 'error', summary: 'Loading Failed', detail: 'Failed to load data' });
          this.loading = false;
      }
  }

  onRoleSelect() {
      if (this.selectedRoleId) {
          this.selectedRoleDetails = this.roles.find(role => role.id === this.selectedRoleId);
          this.roleData.push({
              roleName: this.selectedRoleDetails.roleName,
              permissions: this.selectedRoleDetails.permissions
          });
          this.roleSelected = true;
          this.cdr.detectChanges();
      }
  }

  addRow() {
      if (this.selectedRoleDetails) {
          this.roleData.push({
              roleName: this.selectedRoleDetails.roleName,
              permissions: this.selectedRoleDetails.permissions
          });
          this.selectedAdminIds.push(null);
          this.cdr.detectChanges();
      }
  }

  getAvailableAdmins(index: number) {
      const selectedAdmins = this.selectedAdminIds.filter(id => id !== null && id !== this.selectedAdminIds[index]);
      return this.admins.filter(admin => !selectedAdmins.includes(admin.value));
  }

  onAdminSelect(index: number) {
      this.cdr.detectChanges();
  }

  assignRoles() {
    let successCount = 0;
    let failureCount = 0;

    // Check for duplicate AdminIds
    const duplicateAdmins = this.selectedAdminIds.filter((adminId, index, array) => 
      adminId !== null && array.indexOf(adminId) !== index
    );

    if (duplicateAdmins.length > 0) {
      this.messageService.add({ severity: 'error', summary: 'Duplicate Admin', detail: 'Duplicate Admin IDs found. Please select unique admins.' });
      return;
    }

    this.roleData.forEach((role, index) => {
      const selectedAdminId = this.selectedAdminIds[index];
      const selectedRoleId = this.selectedRoleId;

      if (selectedAdminId && selectedRoleId) {
        this.service.getassignRoles(selectedAdminId, selectedRoleId).subscribe({
          next: (response) => {
            successCount++;
            if (successCount + failureCount === this.roleData.length) {
              this.handleFinalToast(successCount, failureCount);
            }
          },
          error: (error) => {
            console.error('Error assigning role:', error);
            failureCount++;
            if (successCount + failureCount === this.roleData.length) {
              this.handleFinalToast(successCount, failureCount);
            }
          }
        });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Selection Missing', detail: 'Please select an admin and a role to assign' });
      }
    });
  }

  handleFinalToast(successCount: number, failureCount: number) {
    if (successCount > 0) {
      this.messageService.add({ severity: 'success', summary: 'Roles Assigned', detail: `${successCount} roles successfully assigned.` });
    }
    if (failureCount > 0) {
      this.messageService.add({ severity: 'error', summary: 'Assignment Failed', detail: `${failureCount} roles failed to be assigned.` });
    }
  }
}






