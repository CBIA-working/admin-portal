import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from '../student-support/service/service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { RoleListComponent } from '../rolelist/rolelist.component';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    DividerModule,
    TooltipModule,
    CardModule,
    RoleListComponent
  ],
  providers: [Service],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  roleForm: FormGroup;
  pages = [
    { id: 1, name: 'Home' },
    { id: 2, name: 'Dashboard' },
    { id: 3, name: 'Settings' },
    // Add more pages as needed
  ];

  constructor(
    private fb: FormBuilder,
    private service: Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      permissions: this.fb.group({
        read: [],
        write: [],
      }),
    });
  }

  togglePermission(type: string, pageId: number): void {
    const readControl = this.roleForm.get('permissions.read');
    const writeControl = this.roleForm.get('permissions.write');
    
    const readPermissions = readControl?.value || [];
    const writePermissions = writeControl?.value || [];
  
    if (type === 'read') {
      if (readPermissions.includes(pageId)) {
        readControl?.setValue(readPermissions.filter((id: number) => id !== pageId));
      } else {
        readControl?.setValue([...readPermissions, pageId]);
        if (writePermissions.includes(pageId)) {
          this.autoSelectBoth(pageId);
        }
      }
    } else if (type === 'write') {
      if (writePermissions.includes(pageId)) {
        writeControl?.setValue(writePermissions.filter((id: number) => id !== pageId));
      } else {
        writeControl?.setValue([...writePermissions, pageId]);
        if (readPermissions.includes(pageId)) {
          this.autoSelectBoth(pageId);
        }
      }
    } else if (type === 'both') {
      if (readPermissions.includes(pageId) && writePermissions.includes(pageId)) {
        readControl?.setValue(readPermissions.filter((id: number) => id !== pageId));
        writeControl?.setValue(writePermissions.filter((id: number) => id !== pageId));
      } else {
        readControl?.setValue([...readPermissions, pageId]);
        writeControl?.setValue([...writePermissions, pageId]);
      }
    }
  }

  autoSelectBoth(pageId: number): void {
    const readControl = this.roleForm.get('permissions.read');
    const writeControl = this.roleForm.get('permissions.write');
    
    const readPermissions = readControl?.value || [];
    const writePermissions = writeControl?.value || [];
    
    if (!readPermissions.includes(pageId)) {
      readControl?.setValue([...readPermissions, pageId]);
    }
    if (!writePermissions.includes(pageId)) {
      writeControl?.setValue([...writePermissions, pageId]);
    }
  }

  isPermissionSelected(type: string, pageId: number): boolean {
    const control = this.roleForm.get(`permissions.${type}`);
    return control?.value?.includes(pageId);
  }

  isBothSelected(pageId: number): boolean {
    const readControl = this.roleForm.get('permissions.read');
    const writeControl = this.roleForm.get('permissions.write');
    
    const readPermissions = readControl?.value || [];
    const writePermissions = writeControl?.value || [];
    
    return readPermissions.includes(pageId) && writePermissions.includes(pageId);
  }

  tooltipText(type: string): string {
    return `${type} access for this page`;
  }

  onSubmit() {
    if (this.roleForm.valid) {
      const roleData = this.roleForm.value;
      
      // Ensure permissions are in the correct format
      const permissions = [];
      if (this.roleForm.get('permissions.read').value) {
        permissions.push('read');
      }
      if (this.roleForm.get('permissions.write').value) {
        permissions.push('write');
      }
  
      const dataToSend = {
        roleName: roleData.roleName,
        permissions: permissions  // Ensure this is an array
      };
  
      this.service.createRole(dataToSend).subscribe(
        response => {
          console.log('Role created successfully:', response);
          this.router.navigate(['/roles']); // Update with your success route
        },
        error => {
          console.error('Error creating role:', error);
        }
      );
    }
  }
  
}