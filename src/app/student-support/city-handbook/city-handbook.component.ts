import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { PlacesService } from '../service/places.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Marker } from '../domain/schema';
import { Service } from '../service/service';
import { MapAnchorPoint } from '@angular/google-maps';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DownloadComponent } from '../download/download.component';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MessageService,ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavigationService } from '../service/navigation.service';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ChipsModule } from 'primeng/chips';
import { InputGroupModule } from 'primeng/inputgroup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditMarkerComponent } from "./edit-marker/edit-marker.component";




@Component({
  selector: 'app-city-handbook',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, FormsModule, HttpClientModule,
    ButtonModule, TooltipModule, TableModule, RouterModule, InputTextModule,
    TagModule, DropdownModule, MultiSelectModule, ProgressBarModule,
    DownloadComponent, ToastModule, OverlayPanelModule, InputGroupModule,
    InputGroupAddonModule, ChipsModule, DialogModule, ConfirmDialogModule, EditMarkerComponent,
  ],
  providers: [PlacesService, Service, MessageService,ConfirmationService],
  templateUrl: './city-handbook.component.html',
  styleUrls: ['./city-handbook.component.scss']
})
export class CityHandbookComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) map: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild(DownloadComponent) downloadComponent!: DownloadComponent;
  @ViewChild('dt1') table!: Table;
  @ViewChild('auto') autoCompleteInput: ElementRef;

  searchAddress: string;
  marker: Marker[] = [];
  selectedMarker: Marker[] = [];
  selectedMarkers: Marker | null = null;
  loading: boolean = true;
  searchValue: string | undefined;
  downloadSelectedMode: boolean = false;
  dialogVisible: boolean = false;
  currentUser: any = {};
  selectedCourseId: number | null = null;
  center: google.maps.LatLngLiteral = { lat: 51.5074, lng: -0.1278 }; // Central London
  zoom = 13;
  markers: any[] = [];
  nearbyMarkers: any[] = []; // Store nearby markers separately
  circles: google.maps.Circle[] = [];
  selectedMarkerInfo: string;
  nearbyPlaces: any[] = [];
  currentMarkerRef: MapMarker; // Store reference to the current marker
  selectedLocation: google.maps.LatLngLiteral;
  isMarkerPlaced = false; // State to track if the marker is placed
  draggableMarker: google.maps.Marker; 

  constructor(
    private placesService: PlacesService,
    private service: Service,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private navigationService: NavigationService,
    private router: Router,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}


//table
  exportHeaderMapping = {
    id: 'id',
    position: {
      lat: 'lat',
      lng: 'lng',
    },
    label: 'label',
    info: 'info',
  };

  showEditDialog(marker:Marker ): void {
    this.selectedMarkers = marker;
    this.dialogVisible = true;
  }
  onDialogClose(updatedMarkers: Marker | null): void {
    if (updatedMarkers) {
      const index = this.marker.findIndex(s => s.id === updatedMarkers.id);
      if (index !== -1) {
        this.marker[index] = updatedMarkers;
      }
    }
    this.selectedMarkers = null;
    this.dialogVisible = false;
    window.location.reload();
  }
  
  

  ngOnInit(): void {
    this.loadMarkers()
    this.fetchAllMarker();
  }

  fetchAllMarker() {
    this.loading = true;
    this.service.getMarkers().then((marker) => {
      this.marker = marker;
      this.loading = false;
    }).catch(error => {
      console.error('Error fetching all marker', error);
      this.loading = false;
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  deleteCulturalEvent(marker: Marker): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this marker?',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.service.deleteMarkers(marker.id).subscribe(
          () => {
            this.markers = this.markers.filter(markers => markers.id !== markers.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Markers deleted successfully'
            });
            this.ngOnInit();
          },
          error => {
            console.error('Error deleting Markers', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete Markers'
            });
          }
        );
      },
      reject: () => {
        // Optionally handle rejection (user clicks cancel)
      }
    });
  }
  enterSelectionMode() {
    this.downloadSelectedMode = true;
  }

  exitSelectionMode() {
    this.downloadSelectedMode = false;
    this.selectedMarker = [];
  }

  downloadAllStudents(format: string) {
    const data = this.marker.map(Markers => this.mapCustomerToExportFormat(Markers));
    this.download(format, data, 'Markers');
  }

  downloadSelectedStudents() {
    if (this.downloadSelectedMode) {
      if (this.selectedMarker.length === 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select at least one course.'
        });
      } else {
        const data = this.selectedMarker.map(Markers => this.mapCustomerToExportFormat(Markers));
        this.download(this.downloadComponent.format, data, 'selected_Markers');
        this.exitSelectionMode();
      }
    } else {
      console.warn('Download selected Markers called but not in selection mode.');
    }
  }

  mapCustomerToExportFormat(marker: Marker) {
    return {
      ID: marker.id,
      latitude: marker.position.lat,
      longitude: marker.position.lng,
      label: marker.label,
      info: marker.info,

    };
  }

  download(format: string, data: any[], filename: string) {
    if (format === 'excel') {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'Markers': worksheet },
        SheetNames: ['Markers']
      };
      XLSX.writeFile(workbook, `${filename}.xlsx`);
    } else if (format === 'pdf') {
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `${filename}`,
        author: 'Your Name',
        creator: 'Your App'
      });

      doc.setFont('helvetica');

      // Set margins
      const margin = {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      };

      doc.text('Markers List', margin.left, margin.top);
      const columns = Object.values(this.exportHeaderMapping);
      const rows = data.map(course => Object.keys(this.exportHeaderMapping).map(key => course[key]));

      autoTable(doc, {
        margin: { top: 30 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        bodyStyles: { textColor: 50 },
        head: [],
        body: rows
      });

      doc.save(`${filename}.pdf`);
    }
  }


  //maps

  addMarkerBySearch(): void {
    if (this.searchAddress.trim() && this.selectedLocation) {
      const markerData = {
        position: {
          lat: this.selectedLocation.lat,
          lng: this.selectedLocation.lng
        },
        label: this.searchAddress,
        info: 'User added marker',
        draggable: true
      };
  
      this.service.addMarker(markerData).subscribe({
        next: (response) => {
          this.markers.push(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Marker Added',
            detail: 'A new marker has been added to the map'
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add marker'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Selection',
        detail: 'Please select a valid location from the suggestions'
      });
    }
  }
  

  addMarker(lat: number, lng: number, label: string): void {
    const newMarker = { position: { lat, lng }, label: label, info: 'User added marker', draggable: true };
    this.markers.push(newMarker);
    this.messageService.add({
      severity: 'success',
      summary: 'Marker Added',
      detail: 'A new marker has been added to the map'
    });
  }
  

  toggleMarkerPlacement(): void {
    if (!this.isMarkerPlaced) {
      this.placeDraggableMarker();
    } else {
      this.saveMarker();
    }
  }

  placeDraggableMarker(): void {
    if (!google || !google.maps) {
      this.messageService.add({
        severity: 'error',
        summary: 'Google Maps Error',
        detail: 'Google Maps API is not loaded.'
      });
      return;
    }

    const currentCenter = this.map.googleMap.getCenter();

    if (!this.map.googleMap) {
      this.map.googleMap = new google.maps.Map(document.getElementById('map'), {
        center: currentCenter,
        zoom: 14,
      });
    }

    this.draggableMarker = new google.maps.Marker({
      map: this.map.googleMap,
      position: currentCenter,
      draggable: true,
      title: 'Drag me to your desired location'
    });

    google.maps.event.addListener(this.draggableMarker, 'dragend', (event) => this.onMarkerDragEnd(this.draggableMarker, event));

    this.messageService.add({
      severity: 'success',
      summary: 'Draggable Marker Placed',
      detail: 'You can drag this marker to a new location.'
    });

    this.isMarkerPlaced = true; // Update the state to indicate the marker is now placed
  }

  saveMarker(): void {
    const position = this.draggableMarker.getPosition();
    this.placesService.geocodeLatLng(position.lat(), position.lng()).subscribe({
      next: (response) => {
        const address = response.results[0]?.formatted_address || 'Unknown location';
        const markerData = {
          position: { lat: position.lat(), lng: position.lng() },
          label: address, // Dynamic label based on location
          info: 'Marker information' // You can customize this further
        };
  
        this.service.addMarker(markerData).subscribe({
          next: (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Marker Saved',
              detail: 'The new marker has been saved at ' + address
            });
            this.isMarkerPlaced = false; // Reset the state
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Save Failed',
              detail: 'Failed to save the marker.'
            });
          }
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Geocoding Failed',
          detail: 'Failed to retrieve address.'
        });
      }
    });
  }
  
  
// Assuming you have a class property to store the address
address: string;

// And update it in your method
onMarkerDragEnd(marker: any, event: any): void {
  const position = event.latLng;
  this.placesService.geocodeLatLng(position.lat(), position.lng()).subscribe({
    next: (response) => {
      this.address = response.results[0]?.formatted_address || 'Unknown location'; // Store address separately
      this.messageService.add({
        severity: 'info',
        summary: 'Marker Moved',
        detail: `Marker position has been updated to: ${this.address}`
      });

      // Only update lat and lng in selectedLocation
      this.selectedLocation = { lat: position.lat(), lng: position.lng() };
      this.changeDetectorRef.detectChanges();  // Update the view if necessary
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Geocoding Failed',
        detail: 'Failed to retrieve updated address.'
      });
    }
  });
}

  
  

  ngAfterViewInit(): void {
    if (this.downloadComponent) {
      this.downloadComponent.downloadAllStudentsEvent.subscribe((format: string) => {
        this.downloadAllStudents(format);
      });
      this.downloadComponent.downloadSelectedStudentsEvent.subscribe((format: string) => {
        this.enterSelectionMode();
      });
    }

    this.addMarkersToMap();
    this.addInitialCircles(); // Add initial circles if needed
    
    const autocomplete = new google.maps.places.Autocomplete(this.autoCompleteInput.nativeElement);
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          this.searchAddress = place.formatted_address;
          this.selectedLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };

          // Center the map on the new location immediately
          if (!this.map.googleMap) {
            this.map.googleMap = new google.maps.Map(document.getElementById('map'), {
              center: new google.maps.LatLng(this.selectedLocation.lat, this.selectedLocation.lng),
              zoom: 14,
            });
          } else {
            this.map.googleMap.setCenter(new google.maps.LatLng(this.selectedLocation.lat, this.selectedLocation.lng));
          }
          
        }
      });
    });

  }

  loadMarkers() {
    this.service.getMarkers().then(markers => {
      this.markers = markers;
    }).catch(error => {
      console.error('Error fetching markers:', error);
    });
  }

  addMarkersToMap() {
    this.markers.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map: this.map.googleMap,
      });

      marker.addListener('click', () => {
        this.infoWindow.open(marker as unknown as MapAnchorPoint); // Cast to MapAnchorPoint
      });
    });
  }

  openInfoWindow(markerRef: MapMarker) {
    this.currentMarkerRef = markerRef; // Store the marker reference
    const markerData = this.markers.find(marker => marker.position.lat === markerRef.getPosition().lat() && marker.position.lng === markerRef.getPosition().lng());
    if (markerData) {
      this.selectedMarkerInfo = `<strong>${markerData.label}</strong><div>${markerData.info}</div>`;
    }
    this.infoWindow.open(markerRef);
  }

  onMarkerMouseOver(markerRef: MapMarker) {
    this.openInfoWindow(markerRef); // Open info window on hover
  }

  loadNearbyPlaces(placeType: string) {
    if (this.currentMarkerRef) {
      const position = this.currentMarkerRef.getPosition();
      this.fetchNearbyPlaces(position, placeType);
    }
  }

  fetchNearbyPlaces(location: google.maps.LatLng, placeType: string = 'university') {
    this.clearNearbyMarkers(); // Clear old nearby markers

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
                this.nearbyMarkers.push(marker); // Add to nearbyMarkers array
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

  clearNearbyMarkers() {
    // Remove nearby markers from the map and the markers array
    this.nearbyMarkers.forEach(marker => {
      const index = this.markers.indexOf(marker);
      if (index !== -1) {
        this.markers.splice(index, 1);
      }
    });

    // Clear the nearbyMarkers array
    this.nearbyMarkers = [];

    // Clear the circles or other visual elements related to the nearby markers
    this.clearCircles();
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
