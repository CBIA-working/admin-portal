import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Service } from '../service/service';
import { KeyProgramDate } from '../domain/schema';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-keyprogramdates',
  standalone: true,
  imports: [HttpClientModule, CommonModule,FormsModule],
  providers: [Service],
  templateUrl: './keyprogramdates.component.html',
  styleUrls: ['./keyprogramdates.component.scss']
})
export class KeyprogramdatesComponent implements OnInit {
  currentMonthDates: KeyProgramDate[] = [];
  prevMonthDates: KeyProgramDate[] = [];
  nextMonthDates: KeyProgramDate[] = [];
  months: { value: number, name: string }[] = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];
  selectedMonth: number = 7; // Default to July

  constructor(private service: Service) {}

  ngOnInit() {
    this.loadKeyProgramDates(this.selectedMonth);
  }

  onMonthChange(monthValue: any) {
    console.log('Selected Month from Dropdown:', monthValue); // Log selected month value
    const month = parseInt(monthValue, 10); // Convert to number if needed
    this.selectedMonth = month; // Update selectedMonth
    this.loadKeyProgramDates(month);
  }

  private loadKeyProgramDates(month: number): void {
    console.log('Loading key program dates for month:', month);
    this.service.getKeyProgramDates(month).then(data => {
      this.currentMonthDates = data.currentMonthDates || [];
      this.prevMonthDates = data.prevMonthDates || [];
      this.nextMonthDates = data.nextMonthDates || [];
    }).catch(error => {
      console.error('Failed to fetch key program dates:', error);
      // Clear data to avoid displaying old data from previous month on error
      this.currentMonthDates = [];
      this.prevMonthDates = [];
      this.nextMonthDates = [];
    });
  }
}