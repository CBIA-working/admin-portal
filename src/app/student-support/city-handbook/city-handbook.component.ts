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
  styleUrl: './city-handbook.component.scss'
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
      // Assuming you get latitude and longitude from a different property or need to derive them
      const location = this.extractLocationFromPlace(place); // A method to derive location
  
      if (location && location.lat && location.lng) {
        const marker = {
          position: {
            lat: Number(location.lat),  // Ensure latitude is a number
            lng: Number(location.lng)   // Ensure longitude is a number
          },
          label: place.displayName?.name || 'Unknown Place',  // Fallback label
          info: place.formattedAddress || 'No address available'
        };
        this.markers.push(marker);
      } else {
        console.error('Invalid place data:', place);
      }
    });
    this.nearbyPlaces.forEach(place => {
      console.log('Place Data:', place);
      console.log('Display Name:', place.displayName);
    });
    
  }
  
  // Example method to extract location - modify based on your actual data structure
  extractLocationFromPlace(place: any): { lat: number, lng: number } | null {
    // Replace with actual extraction logic
    // This is just an example assuming location could be nested
    return place.location ? {
      lat: place.location.lat,
      lng: place.location.lng
    } : null;
    
  }
  
  
}
