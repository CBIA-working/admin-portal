import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class Service {
    private readonly BASE_URL: string = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {}

    getStudents(params?: any) {
        return this.http.get<any>(`${this.BASE_URL}/getUsers`, { params: params }).toPromise();
    }

    getCultural(params?: any) {
        return this.http.get<any>(`${this.BASE_URL}/CulturalEventAdmin`, { params: params }).toPromise();
    }

    getAccomodation(params?: any) {
        return this.http.get<any>(`${this.BASE_URL}/AccomodationAdmin`, { params: params }).toPromise();
    }
    getCourse(params?: any) {
        return this.http.get<any>(`${this.BASE_URL}/CoursesAdmin`, { params: params }).toPromise();
    }

    getStudentEvents(data: { Id: number, type: string }): Promise<any> {
        return this.http.post(`${this.BASE_URL}/StudentEvents`, data).toPromise();
    }

    getStudentAccomodation(data: { Id: number, type: string }): Promise<any> {
        return this.http.post(`${this.BASE_URL}/StudentAccomodation`, data).toPromise();
    }
    getStudentCourse(data: { Id: number, type: string }): Promise<any> {
        return this.http.post(`${this.BASE_URL}/StudentCourse`, data).toPromise();
    }
     // Add the updateProfile method
     updateProfile(formData: FormData) {
        return this.http.post(`${this.BASE_URL}/updateProfile`, formData);
    }
}
