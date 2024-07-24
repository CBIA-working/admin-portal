import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Faq } from '../student-support/domain/schema';
import { Service } from '../student-support/service/service';

interface Column {
    field: string;
    header: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule, HttpClientModule, TableModule, ButtonModule, DropdownModule,
    InputTextModule, MultiSelectModule, ProgressBarModule, TagModule,
    ToastModule, FormsModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule, DialogModule, ConfirmDialogModule
  ],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  providers: [Service, MessageService, ConfirmationService, DatePipe]
})
export class FaqComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  faqs: Faq[] = [];
  selectedFaq: Faq | null = null;
  loading: boolean = true;
  searchValue: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private service: Service,
    private messageService: MessageService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchAllFaq();
  }

  fetchAllFaq() {
    this.loading = true;
    this.service.getFaq().then(faqs => {
      this.faqs = faqs;
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching FAQs', error);
      this.loading = false;
    });
  }

  clear() {
    this.table.clear();
    this.searchValue = '';
  }
}
