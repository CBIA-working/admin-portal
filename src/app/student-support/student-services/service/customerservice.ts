// customer.service.ts or student-services.component.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../domain/customer';
import { Observable } from 'rxjs';

@Injectable()
export class CustomerService {
  constructor(private http: HttpClient) {}

  getCustomers(): Promise<Customer[]> {
    return this.http.get<Customer[]>('https://maui-portal.vercel.app/api/getUsers').toPromise();
  }

  getCulturalEvents(): Observable<any[]> {
    return this.http.get<any[]>('http://192.168.56.1:3000/api/CulturalEvent');
  }

  getAccommodations(): Observable<any[]> {
    return this.http.get<any[]>('http://192.168.56.1:3000/api/Accomodation');
  }
}

