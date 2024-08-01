import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-city-handbook',
  standalone: true,
  imports: [GoogleMapsModule,CommonModule,FormsModule],
  templateUrl: './city-handbook.component.html',
  styleUrl: './city-handbook.component.scss'
})
export class CityHandbookComponent {
  center: google.maps.LatLngLiteral = { lat: 51.5074, lng: -0.1278 }; // Central London
  zoom = 10;
  markers = [
    {
      position: { lat: 51.5194, lng: -0.1270 },
      label: 'British Museum',
      info: 'Great Russell St, Bloomsbury, London WC1B 3DG, United Kingdom'
    },
    {
      position: { lat: 51.5033, lng: -0.1195 },
      label: 'London Eye',
      info: 'The Queen’s Walk, Bishop’s, London SE1 7PB, United Kingdom'
    },
    {
      position: { lat: 51.5007, lng: -0.1246 },
      label: 'Big Ben',
      info: 'Westminster, London SW1A 0AA, United Kingdom'
    }
  ];
  
}