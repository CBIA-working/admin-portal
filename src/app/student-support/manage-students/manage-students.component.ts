import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CustomerService } from './service/customerservice';
import { Customer, Representative,} from './domain/customer';
import { AddStudentComponent } from './add-student/add-student.component';

@Component({
  selector: 'app-manage-students',
  standalone:true,
  imports: [TableModule, RouterModule, 
    HttpClientModule, 
    CommonModule, InputTextModule, TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule,
    AddStudentComponent ],
  providers: [CustomerService],
  templateUrl: './manage-students.component.html',
  styleUrl: './manage-students.component.scss'
})
export class ManageStudentsComponent implements OnInit {
    customers!: Customer[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    searchValue: string | undefined;

    constructor(private customerService: CustomerService) {}

    ngOnInit() {
        this.customerService.getCustomers().then((customers) => {
            this.customers = customers;
            this.loading = false;

        });
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = ''
    }
}

