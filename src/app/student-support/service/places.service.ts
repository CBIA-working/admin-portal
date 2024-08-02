import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private apiKey = 'AIzaSyBuaF5AtlcvqvOQdzO14DgIx4aaNyIBuuo'; // Replace with your Google API key
  private apiUrl = 'https://places.googleapis.com/v1/places:searchNearby';

  constructor(private http: HttpClient) { }

  searchNearby(latitude: number, longitude: number, radius: number, type: string): Observable<any> {
    const url = `${this.apiUrl}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.apiKey,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.types,places.websiteUri'
    });

    const body = {
      includedTypes: [type],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude
          },
          radius
        }
      }
    };

    return this.http.post(url, body, { headers });
  }
}
