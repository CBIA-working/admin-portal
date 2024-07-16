import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accomodation, CulturalEvent } from '../domain/schema';

@Injectable()
export class Service {
    private readonly BASE_URL: string = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {}


//admin
getupdateProfile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/updateProfile`, formData);
  }



//students 
    getStudents(params?: any): Promise<any> {
        return this.http.get<any>(`${this.BASE_URL}/studentsAdmin`, { params }).toPromise();
    }

    getupdateStudent(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/updateStudents`, formData);
      }
    deleteStudents(studentId: number): Observable<void> {
        return this.http.request<void>('delete', `${this.BASE_URL}/deleteStudents`, 
            { body: { id: studentId } });
      }
      addStudent(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/registerStudent`, formData);
      }

//culttural events
    getCultural(params?: any): Promise<any> {
        return this.http.get<any>(`${this.BASE_URL}/CulturalEventAdmin`, { params }).toPromise();
    }
    
    getStudentEvents(data: { Id: number, type: string }): Promise<any> {
        return this.http.post(`${this.BASE_URL}/StudentEvents`, data).toPromise();
    }

    getupdateEvents(params?: any): Observable<any>  {
        return this.http.post<any>(`${this.BASE_URL}/updateCulturalEvents`,params);
    }
    deleteCulturalEvent(eventId: number): Observable<void> {
        return this.http.delete<void>(`${this.BASE_URL}/deleteCulturalEvents`, { 
          body: { id: eventId } 
    });
    }
    addEvent(event: CulturalEvent): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/addCulturalEvent`, event);
    }
    assignEvent(studentId: number, eventId: number): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/assignEvent`, { studentId, eventId });
    }
    deleteAssignment(studentId: number, eventId: number): Observable<any> {
        return this.http.request('DELETE', `${this.BASE_URL}/deleteAssign`, {
          body: { studentId, eventId }
        });
      }
//accomodation
    getAccomodation(params?: any): Promise<any> {
        return this.http.get<any>(`${this.BASE_URL}/AccomodationAdmin`, { params }).toPromise();
    }
    getStudentAccomodation(data: { Id: number, type: string }): Promise<any> {
        return this.http.post(`${this.BASE_URL}/StudentAccomodation`, data).toPromise();
    }
    getupdateAccomodation(params?: any): Observable<any>  {
        return this.http.post<any>(`${this.BASE_URL}/updateAccomodation`,params);
    }
    deleteAccomodation(accomodationId : number): Observable<void> {
        return this.http.delete<void>(`${this.BASE_URL}/deleteAccomodation`, { 
          body: { id: accomodationId } 
    });
    }
    addAccomodation(accomodation: Accomodation): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/addAccomodation`, accomodation);
    }
    assignAccomodation(studentId: number, accomodationId: number): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/assignAccomodation`, { studentId, accomodationId });
    }
    deleteAssignAccomodation(studentId: number, accomodationId: number): Observable<any> {
        return this.http.request('DELETE', `${this.BASE_URL}/deleteAssignAccomodation`, {
          body: { studentId, accomodationId }
        });
      }
//course
    getCourse(params?: any): Promise<any> {
        return this.http.get<any>(`${this.BASE_URL}/CoursesAdmin`, { params }).toPromise();
    }

    getStudentCourse(data: { Id: number, type: string }): Promise<any> {
        return this.http.post(`${this.BASE_URL}/StudentCourse`, data).toPromise();
    }


   
}
