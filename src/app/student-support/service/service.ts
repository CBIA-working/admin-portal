import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Service {
    private readonly BASE_URL: string = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {}

    getStudents(params?: any): Promise<any> {
        return this.http.get<any>(`${this.BASE_URL}/getUsers`, { params }).toPromise();
    }

    getCultural(params?: any): Promise<any> {
        return this.http.get<any>(`${this.BASE_URL}/CulturalEventAdmin`, { params }).toPromise();
    }

    getAccomodation(params?: any): Promise<any> {
        return this.http.get<any>(`${this.BASE_URL}/AccomodationAdmin`, { params }).toPromise();
    }

    getCourse(params?: any): Promise<any> {
        return this.http.get<any>(`${this.BASE_URL}/CoursesAdmin`, { params }).toPromise();
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

    getupdateProfile(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/updateProfile`, formData);
      }
    getupdateStudent(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/updateProfile`, formData);
      }
}
