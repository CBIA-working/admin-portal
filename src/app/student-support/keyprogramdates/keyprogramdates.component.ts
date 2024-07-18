import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Service } from '../service/service';
import { KeyProgramDate } from '../domain/schema';

@Component({
  selector: 'app-keyprogramdates',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  providers: [Service],
  templateUrl: './keyprogramdates.component.html',
  styleUrls: ['./keyprogramdates.component.scss']
})
export class KeyprogramdatesComponent implements OnInit {
  keyProgramDates: KeyProgramDate[][] = [];  // Change to array of arrays to represent months

  constructor(private service: Service) {}

  ngOnInit() {
    this.loadKeyProgramDates();
  }

  private loadKeyProgramDates(): void {
    this.service.getkeyprogramdates().then(data => {
      // Directly use the object values if the structure is appropriate
      this.keyProgramDates = Object.values(data);
    }).catch(error => {
      console.error('Failed to fetch key program dates:', error);
    });
  }
}
