import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accomodation, Courses, CulturalEvent, KeyProgramDate, Program } from '../domain/schema';

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

    getupdateCourse(params?: any): Observable<any>  {
        return this.http.post<any>(`${this.BASE_URL}/updateCourses`,params);
    }
    deleteCourse(courseId: number): Observable<void> {
        return this.http.delete<void>(`${this.BASE_URL}/deleteCourses`, { 
          body: { id: courseId } 
    });
    }
    addCourse(course: Courses): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/addCourses`, course);
    }
    assignCourse(studentId: number, courseId: number): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/assignCourses`, { studentId, courseId });
    }
    deleteAssignCourse(studentId: number, courseId: number): Observable<any> {
        return this.http.request('DELETE', `${this.BASE_URL}/deleteAssignCourses`, {
          body: { studentId, courseId }
        });
      }
//keyprogramdates

    getKeyProgramDates(month: number): Promise<any> {
    const url = `${this.BASE_URL}/KeyProgramDatesAdmin`;
    const body = { month };
    return this.http.post(url, body).toPromise();
    }

    addKeyProgramDates(keyProgramDate: KeyProgramDate): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/AddKeyProgramDates`, keyProgramDate);
    }

    getupdatekeyprogramdates(keyProgramDate: KeyProgramDate): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/UpdateKeyProgramDates`, keyProgramDate);
      }
      deleteKeyProgramDates(keyProgramDateId: number): Observable<void> {
        return this.http.delete<void>(`${this.BASE_URL}/DeleteKeyProgramDates`, { 
          body: { id: keyProgramDateId } 
    });
    }

//faq
    getFaq(params?: any): Promise<any> {
    return this.http.get<any>(`${this.BASE_URL}/faqadmin`, { params }).toPromise();
    }

//Program
    getProgram(params?: any): Promise<any> {
    return this.http.get<any>(`${this.BASE_URL}/ProgramAdmin`, { params }).toPromise();
    }

    getStudentProgram(data: { Id: number, type: string }): Promise<any> {
    return this.http.post(`${this.BASE_URL}/StudentProgram`, data).toPromise();
    }
    getCourseProgram(data: { Id: number, type: string }): Promise<any> {
        return this.http.post(`${this.BASE_URL}/CourseProgram`, data).toPromise();
    }
    getupdateProgram(params?: any): Observable<any>  {
        return this.http.post<any>(`${this.BASE_URL}/updateProgram`,params);
    }
    deleteProgram(ProgramId: number): Observable<void> {
        return this.http.delete<void>(`${this.BASE_URL}/deleteProgram`, { 
          body: { id: ProgramId } 
    });
    }
    addProgram(program: Program): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/addProgram`, program);
    }
    getArchivedPrograms(): Observable<Program[]> {
        return this.http.get<Program[]>(`${this.BASE_URL}/archived`);
      }
    
    archiveProgram(id: number): Observable<Program> {
        return this.http.post<Program>(`${this.BASE_URL}/archive`, { id });
      }
    unarchiveProgram(programId: number): Observable<any> {
        return this.http.post(`${this.BASE_URL}/unarchive`, { id: programId });
      }
      copyProgram(id: number): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/copyProgram`, { id });
      }
}
