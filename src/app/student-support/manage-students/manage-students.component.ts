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

@Component({
  selector: 'app-manage-students',
  standalone:true,
  imports: [TableModule, RouterModule, 
    HttpClientModule, 
    CommonModule, InputTextModule, TagModule, DropdownModule, MultiSelectModule, ProgressBarModule, ButtonModule ],
  providers: [CustomerService],
  templateUrl: './manage-students.component.html',
  styleUrl: './manage-students.component.scss'
})
export class ManageStudentsComponent implements OnInit {
    customers!: Customer[];

    // representatives!: Representative[];

    // statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    searchValue: string | undefined;

    constructor(private customerService: CustomerService) {}

    ngOnInit() {
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers = customers;
            this.loading = false;

        });

        // this.representatives = [
        //     { name: 'Amy Elsner', image: 'amyelsner.png' },
        //     { name: 'Anna Fali', image: 'annafali.png' },
        //     { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        //     { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        //     { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        //     { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        //     { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        //     { name: 'Onyama Limba', image: 'onyamalimba.png' },
        //     { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        //     { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
        // ];

        // this.statuses = [
        //     { label: 'Unqualified', value: 'unqualified' },
        //     { label: 'Qualified', value: 'qualified' },
        //     { label: 'New', value: 'new' },
        //     { label: 'Negotiation', value: 'negotiation' },
        //     { label: 'Renewal', value: 'renewal' },
        //     { label: 'Proposal', value: 'proposal' }
        // ];
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = ''
    }

    getSeverity(status: string) {
        switch (status.toLowerCase()) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warning';

            case 'renewal':
                return null;
        }
    }
}

