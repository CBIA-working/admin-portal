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
  selectedAdminId: number | null = null;
  selectedRoleId: number | null = null;
  selectedRoleDetails: any | null = null;
  loading: boolean = true;
  roleSelected: boolean = false; // Track if a role is selected

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
          this.roleSelected = true; // Set roleSelected to true once a role is selected
          this.cdr.detectChanges(); // Ensure the UI updates after setting the selectedRoleDetails
      }
  }

  assignRole() {
      if (this.selectedAdminId && this.selectedRoleId) {
          this.service.getassignRoles(this.selectedAdminId, this.selectedRoleId).subscribe({
              next: (response) => {
                  this.messageService.add({ severity: 'success', summary: 'Role Assigned', detail: 'Role successfully assigned to admin' });
              },
              error: (error) => {
                  console.error('Error assigning role:', error);
                  this.messageService.add({ severity: 'error', summary: 'Assignment Failed', detail: 'Failed to assign role' });
              }
          });
      } else {
          this.messageService.add({ severity: 'warn', summary: 'Selection Missing', detail: 'Please select an admin and a role to assign' });
      }
  }
}

