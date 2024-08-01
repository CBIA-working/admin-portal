import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-city-handbook',
  standalone: true,
  imports: [GoogleMapsModule,CommonModule,FormsModule],
  templateUrl: './city-handbook.component.html',
  styleUrl: './city-handbook.component.scss'
})
export class CityHandbookComponent implements OnInit {
  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  center: google.maps.LatLngLiteral = { lat: 51.5074, lng: -0.1278 }; // Central London
  zoom = 10;
  markers = [
    {
      position: { lat: 51.5194, lng: -0.1270 },
      label: 'British Museum',
      info: 'Great Russell St,<br>Bloomsbury,<br>London WC1B 3DG,<br>United Kingdom'
    },
    {
      position: { lat: 51.5033, lng: -0.1195 },
      label: 'London Eye',
      info: 'The Queen’s Walk,<br> Bishop’s,<br> London SE1 7PB, United Kingdom'
    },
    {
      position: { lat: 51.5007, lng: -0.1246 },
      label: 'Big Ben',
      info: 'Westminster,<br> London SW1A 0AA,<br> United Kingdom'
    }
    // Add other markers...
  ];
  selectedMarkerInfo: string;

  ngOnInit(): void {
  }

  openInfoWindow(markerRef: MapMarker) {
    const markerData = this.markers.find(marker => marker.position.lat === markerRef.getPosition().lat() && marker.position.lng === markerRef.getPosition().lng());
    if (markerData) {
      this.selectedMarkerInfo = `<strong>${markerData.label}</strong><div>${markerData.info}</div>`;
    }
    this.infoWindow.open(markerRef);
  }

}