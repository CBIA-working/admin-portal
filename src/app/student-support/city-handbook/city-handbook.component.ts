import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { PlacesService } from '../service/places.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-city-handbook',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, FormsModule, HttpClientModule],
  providers: [PlacesService],
  templateUrl: './city-handbook.component.html',
  styleUrls: ['./city-handbook.component.scss']
})

export class CityHandbookComponent implements OnInit {
  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  center: google.maps.LatLngLiteral = { lat: 51.5074, lng: -0.1278 }; // Central London
  zoom = 10;
  markers: any[] = [
    {
      position: { lat: 51.5194, lng: -0.1270 },
      label: 'British Museum',
      info: 'Great Russell St,<br>Bloomsbury,<br>London WC1B 3DG,<br>United Kingdom'
    }
  ];
  selectedMarkerInfo: string;
  nearbyPlaces: any[] = [];

  constructor(private placesService: PlacesService) {}

  ngOnInit(): void {}

  openInfoWindow(markerRef: MapMarker) {
    const markerData = this.markers.find(marker => marker.position.lat === markerRef.getPosition().lat() && marker.position.lng === markerRef.getPosition().lng());
    if (markerData) {
      this.selectedMarkerInfo = `<strong>${markerData.label}</strong><div>${markerData.info}</div>`;
      this.fetchNearbyPlaces(markerRef.getPosition());
    }
    this.infoWindow.open(markerRef);
  }

  fetchNearbyPlaces(location: google.maps.LatLng) {
    this.placesService.searchNearby(location.lat(), location.lng(), 500, 'restaurant').subscribe(
      (response) => {
        console.log('API Response:', response); // Log the response
        this.nearbyPlaces = response.places || [];
        this.addNearbyMarkers();
      },
      (error) => {
        console.error('Error fetching nearby places:', error); // Log the error
        this.nearbyPlaces = [];
      }
    );
  }

  addNearbyMarkers() {
    this.nearbyPlaces.forEach(place => {
      if (place.formattedAddress) {
        this.placesService.geocodeAddress(place.formattedAddress).subscribe(
          (response) => {
            if (response.results && response.results.length > 0) {
              const location = response.results[0].geometry.location;
              const marker = {
                position: {
                  lat: location.lat,
                  lng: location.lng
                },
                label: place.displayName?.text || 'Unknown Place',
                info: place.formattedAddress || 'No address available'
              };
              this.markers.push(marker);
            } else {
              console.error('No geocoding results for address:', place.formattedAddress);
            }
          },
          (error) => {
            console.error('Error geocoding address:', error);
          }
        );
      } else {
        console.error('Missing formattedAddress for place:', place);
      }
    });
  }
}
