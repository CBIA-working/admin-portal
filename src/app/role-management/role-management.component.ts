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
import { RoleListComponent } from './rolelist/rolelist.component';
import { NavigationsService } from '../student-support/service/navigations.service';

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
    RoleListComponent,
  ],
  providers: [Service],
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  roleForm: FormGroup;
  pages = [];

  constructor(
    private fb: FormBuilder,
    private service: Service,
    private router: Router,
    private navService: NavigationsService
  ) {}

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      permissions: this.fb.group({
        read: [],
        write: [],
      }),
    });
    // Get pages from NavigationService
    this.pages = this.navService.getPages().map(page => ({
      id: page.path,  // Use path as id for simplicity
      name: page.title  // Use the title as name
    }));
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
  
      // Prepare permissions with page names
      let permissions = {
        read: [],
        write: [],
        both: []
      };
  
      this.pages.forEach(page => {
        if (this.isPermissionSelected('read', page.id) && !this.isPermissionSelected('write', page.id)) {
          permissions.read.push(page.name);
        }
        if (this.isPermissionSelected('write', page.id) && !this.isPermissionSelected('read', page.id)) {
          permissions.write.push(page.name);
        }
        if (this.isBothSelected(page.id)) {
          permissions.both.push(page.name);
        }
      });
  
      const dataToSend = {
        roleName: roleData.roleName,
        permissions
      };
  
      this.service.createRole(dataToSend).subscribe(
        response => {
          console.log('Role created successfully:', response);
          this.router.navigate(['/roles']); // Navigate to the roles listing page on success
        },
        error => {
          console.error('Error creating role:', error);
        }
      );
    }
  }
}  