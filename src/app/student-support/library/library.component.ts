import { Component, OnInit } from '@angular/core';
import { Service } from '../service/service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule,CardModule,HttpClientModule,FormsModule],
  providers: [Service],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit{
  programs: any[] = [];

  constructor(private service: Service,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.service.getProgram().then(data => {
      this.programs = data; // Assuming the data is an array of programs
    }).catch(error => {
      console.error('Failed to load programs:', error);
    });
  }
}

