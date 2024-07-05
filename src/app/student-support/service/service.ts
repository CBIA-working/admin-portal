import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class Service {

    constructor(private http: HttpClient) {}
    

    getStudents(params?: any) {
        return this.http.get<any>('https://maui-portal.vercel.app/api/getUsers', { params: params }).toPromise();
    }
    getCultural(params?: any) {
        return this.http.post<any>('http://localhost:3000/api/CulturalEvent', { params: params }).toPromise();
    }
    getAccomodation(params?: any) {
        return this.http.post<any>('http://localhost:3000/api/AccomodationAdmin', { params: params }).toPromise();
    }
    getStudentEvents(data: { Id: number, type: string }): Promise<any> {
        return this.http.post('http://localhost:3000/api/StudentEvents', data).toPromise();
    }
  
};