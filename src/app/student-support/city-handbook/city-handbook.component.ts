

import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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

export class CityHandbookComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  center: google.maps.LatLngLiteral = { lat: 51.5074, lng: -0.1278 }; // Central London
  zoom = 10;
  markers: any[] = [
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
  ];
  circles: google.maps.Circle[] = [];
  selectedMarkerInfo: string;
  nearbyPlaces: any[] = [];

  constructor(private placesService: PlacesService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.addInitialCircles(); // Add initial circles if needed
  }

  openInfoWindow(markerRef: MapMarker) {
    const markerData = this.markers.find(marker => marker.position.lat === markerRef.getPosition().lat() && marker.position.lng === markerRef.getPosition().lng());
    if (markerData) {
      this.selectedMarkerInfo = `<strong>${markerData.label}</strong><div>${markerData.info}</div>`;
      this.fetchNearbyPlaces(markerRef.getPosition(), 'university'); // or any other type you want
    }
    this.infoWindow.open(markerRef);
  }
  
  fetchNearbyPlaces(location: google.maps.LatLng, placeType: string = 'university') {
    this.placesService.searchNearby(location.lat(), location.lng(), 500, placeType).subscribe(
      (response) => {
        console.log('API Response:', response); // Log the response
        this.nearbyPlaces = response.places || [];
        this.addNearbyMarkers(location);
      },
      (error) => {
        console.error('Error fetching nearby places:', error); // Log the error
        this.nearbyPlaces = [];
      }
    );
  }

  addNearbyMarkers(location: google.maps.LatLng) {
    this.clearCircles(); // Clear existing circles
    const circle = new google.maps.Circle({
      center: location.toJSON(), // Use the location as the center of the circle
      radius: 1000, // Increase the radius in meters
      map: this.map.googleMap, // Reference to the Google Map instance
      fillColor: '#87CEEB',
      fillOpacity: 0.2,
      strokeColor: '#87CEEB',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
    this.circles.push(circle);

    this.nearbyPlaces = this.nearbyPlaces.filter(place => {
      if (place.formattedAddress) {
        this.placesService.geocodeAddress(place.formattedAddress).subscribe(
          (response) => {
            if (response.results && response.results.length > 0) {
              const placeLocation = response.results[0].geometry.location;
              const distance = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(location.lat(), location.lng()),
                new google.maps.LatLng(placeLocation.lat, placeLocation.lng)
              );

              // Check if the place is within the circle's radius
              if (distance <= circle.getRadius()) {
                const marker = {
                  position: {
                    lat: placeLocation.lat,
                    lng: placeLocation.lng
                  },
                  label: place.displayName?.text || 'Unknown Place',
                  info: place.formattedAddress || 'No address available'
                };
                this.markers.push(marker);
              }
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

  clearCircles() {
    this.circles.forEach(circle => circle.setMap(null));
    this.circles = [];
  }

  addInitialCircles() {
    // Optionally add initial circles around the predefined markers
    this.markers.forEach(marker => {
      const circle = new google.maps.Circle({
        center: marker.position,
        radius: 1000, // Increase the radius in meters
        map: this.map.googleMap,
        fillColor: '#87CEEB',
        fillOpacity: 0.2,
        strokeColor: '#87CEEB',
        strokeOpacity: 0.8,
        strokeWeight: 2
      });
      this.circles.push(circle);
    });
  }
}

