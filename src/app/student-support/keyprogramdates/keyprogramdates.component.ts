import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Service } from '../service/service';
import { KeyProgramDate } from '../domain/schema';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';

@Component({
  selector: 'app-keyprogramdates',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, CalendarModule, CardModule, ButtonModule, PrimeTemplate],
  providers: [Service],
  templateUrl: './keyprogramdates.component.html',
  styleUrls: ['./keyprogramdates.component.scss']
})
export class KeyprogramdatesComponent implements OnInit {
  currentMonthDates: KeyProgramDate[] = [];
  events: { [date: string]: KeyProgramDate[] } = {};  // Events by date
  selectedDateEvents: KeyProgramDate[] = [];
  showDetails: boolean = false;

  constructor(private service: Service) {}

  ngOnInit() {
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are zero-indexed
    this.loadKeyProgramDates(currentMonth);
  }
  
  loadKeyProgramDates(month: number): void {
    this.service.getKeyProgramDates(month).then(data => {
      // Combine all month data into a single array
      const allDates = [...data.prevMonthDates, ...data.currentMonthDates, ...data.nextMonthDates];
  
      this.currentMonthDates = allDates;
      this.events = allDates.reduce((acc, event) => {
        // Convert UTC date to local date
        const eventDate = new Date(event.date);
        const dateStr = eventDate.toLocaleDateString();  // Using locale date string for key
        if (!acc[dateStr]) {
          acc[dateStr] = [];
        }
        acc[dateStr].push(event);
        return acc;
      }, {});
    }).catch(error => {
      console.error('Failed to fetch key program dates:', error);
      this.currentMonthDates = [];
      this.events = {};
    });
  }

  onDateSelect(event: any): void {
    // Using local date for selection
    const selectedDate = new Date(event).toLocaleDateString();
    this.selectedDateEvents = this.events[selectedDate] || [];
    this.showDetails = this.selectedDateEvents.length > 0;
  }

  onMonthChange(event: any): void {
    const newMonth = event.month + 1; // PrimeNG months are zero-indexed
    this.loadKeyProgramDates(newMonth);
  }

  hasEvents(date: any): boolean {
    // Ensure comparison is done using local date
    const checkDate = new Date(date.year, date.month, date.day);
    const dateStr = checkDate.toLocaleDateString();
    return this.events[dateStr] ? true : false;
  }
}
