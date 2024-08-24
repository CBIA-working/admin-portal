import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accomodation, Courses, CulturalEvent, Faq, KeyProgramDate, Library, Marker, OrientationFile, Program, Tasks, Trip } from '../domain/schema';

@Injectable()
export class Service {
    private readonly BASE_URL: string = 'http://localhost:3000/api';
    private readonly PDF_URL: string = 'http://localhost:3000/agreement';

    constructor(private http: HttpClient) {}

//role
createRole(roleData: any): Observable<any> {
  return this.http.post(`${this.BASE_URL}/roles`, roleData);
}
getRoles(): Observable<any[]> {
  return this.http.get<any[]>(`${this.BASE_URL}/role`);
}

getupdateRoles(params?: any): Observable<any> {
  return this.http.put<any>(`${this.BASE_URL}/updateroles`, params);
}
deleteroles(roleId: number): Observable<void> {
  return this.http.delete<void>(`${this.BASE_URL}/deleteroles`, { 
    params: { id: roleId.toString() }
  });
}
getassignRoles(AdminId: number, RoleId: number): Observable<any> {
  return this.http.post<any>(`${this.BASE_URL}/adminRole`, { AdminId, RoleId });
}
getAdminRoles(params?: any): Promise<any> {
  return this.http.get<any>(`${this.BASE_URL}/getadminroles`, { params }).toPromise();
}

updateAdminRole(data: { AdminId: number; RoleId: number }): Observable<any> {
  return this.http.put<any>(`${this.BASE_URL}/updateAssignRole`, data);
}

deleteAssignedRole(roleId: number): Observable<void> {
  return this.http.delete<void>(`${this.BASE_URL}/deleteAssignedRole?id=${roleId}`);
}

//admin
getupdateProfile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/updateProfile`, formData);
}
getAdmin(params?: any): Promise<any> {
    return this.http.get<any>(`${this.BASE_URL}/adminData`, { params }).toPromise();
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

//accmodationpdf
getPdfUrl1(): string {
    return `${this.PDF_URL}/House_Rules_Agreement.pdf`;
}
getPdfUrl2(): string {
    return `${this.PDF_URL}/Rental_Agreement_Lease_Agreement.pdf`;
}
getPdfUrl3(): string {
    return `${this.PDF_URL}/Security_Deposit_Agreement.pdf`;
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

//trips
getTrip(params?: any): Promise<any> {
    return this.http.get<any>(`${this.BASE_URL}/TripsAdmin`, { params }).toPromise();
}

getStudentTrips(data: { Id: number, type: string }): Promise<any> {
    return this.http.post(`${this.BASE_URL}/StudentTrips`, data).toPromise();
}

getupdateTrips(params?: any): Observable<any>  {
    return this.http.post<any>(`${this.BASE_URL}/updateTrips`,params);
}
deleteTrip(tripId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/deleteTrips`, { 
      body: { id: tripId } 
});
}
addTrip(trip: Trip): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/addTrips`, trip);
}
assignTrip(studentId: number, tripId: number): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/assignTrips`, { studentId, tripId });
}
deleteAssignmentTrip(studentId: number, tripId: number): Observable<any> {
    return this.http.request('DELETE', `${this.BASE_URL}/deleteTrips`, {
      body: { studentId, tripId }
    });
  }

//faq
    getFaq(params?: any): Promise<any> {
    return this.http.get<any>(`${this.BASE_URL}/faqadmin`, { params }).toPromise();
    }
    addFaq(faq: Faq): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/addFaq`, faq);
    }
    getupdateFaq(params?: any): Observable<any>  {
        return this.http.post<any>(`${this.BASE_URL}/updateFaq`,params);
    }
    deleteFaq(FaqId: number): Observable<void> {
        return this.http.delete<void>(`${this.BASE_URL}/deleteFaq`, { 
          body: { id: FaqId } 
    });
    }
    saveFaqOrder(faqs: { id: number; order: number }[]): Observable<any> {
        return this.http.post<any>(`${this.BASE_URL}/updateOrder`, faqs);
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

//cityhandbook
  getMarkers(params?: any): Promise<Marker[]> {
    return this.http.get<Marker[]>(`${this.BASE_URL}/markersAdmin`, { params }).toPromise();
  }
  deleteMarkers(markerId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/deleteMarkers`, { 
      body: { id: markerId } 
  });
  }
  getupdateMarker(params?: any): Observable<any>  {
    return this.http.post<any>(`${this.BASE_URL}/updateMarker`,params);
  }
  addMarker(markerData: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/addMarker`, markerData);
  }

//orientation
getOrientation(params?: any): Promise<OrientationFile[]> {
  return this.http.get<OrientationFile[]>(`${this.BASE_URL}/OrientationAdmin`, { params }).toPromise();
}
addOrientation(orientationFile: OrientationFile): Observable<any> {
  return this.http.post<any>(`${this.BASE_URL}/addOrientation`, orientationFile);
}

deleteOrientation(OrientationId: number): Observable<void> {
  return this.http.delete<void>(`${this.BASE_URL}/deleteOrientation`, { 
    body: { id: OrientationId } 
});
}
getupdateOrientation(params?: any): Observable<any>  {
  return this.http.post<any>(`${this.BASE_URL}/updateOrientation`,params);
}
uploadFile(formData: FormData): Observable<any> {
  return this.http.post(`${this.BASE_URL}/uploadOrientation`, formData); // Use backticks for template literals
}

//Library
getLibrary(params?: any): Promise<Library[]> {
  return this.http.get<Library[]>(`${this.BASE_URL}/LibraryAdmin`, { params }).toPromise();
}
getLibraryProgram(data: { Id: number, type: string }): Promise<any> {
  return this.http.post(`${this.BASE_URL}/LibraryProgram`, data).toPromise();
}
getStudentLibrary(data: { Id: number, type: string }): Promise<any> {
  return this.http.post(`${this.BASE_URL}/StudentLibrary`, data).toPromise();
  }
addLibrary(library: Library): Observable<any> {
  return this.http.post<any>(`${this.BASE_URL}/addLibrary`, library);
}

deleteLibrary(LibraryId: number): Observable<void> {
  return this.http.delete<void>(`${this.BASE_URL}/deleteLibrary`, { 
    body: { id: LibraryId } 
});
}
getupdateLibrary(params?: any): Observable<any>  {
  return this.http.post<any>(`${this.BASE_URL}/updateLibrary`,params);
}
uploadLibraryBook(formData: FormData): Observable<any> {
  return this.http.post(`${this.BASE_URL}/uploadLibraryBook`, formData); // Use backticks for template literals
}

//tasks
getTasks(params?: any): Promise<Tasks[]> {
  return this.http.get<Tasks[]>(`${this.BASE_URL}/tasksAdmin`, { params }).toPromise();
}
deleteTasks(TasksId: number): Observable<void> {
  return this.http.delete<void>(`${this.BASE_URL}/deleteTasks`, { 
    body: { id: TasksId } 
});
}
getStudentTasks(data: { Id: number, type: string }): Promise<any> {
  return this.http.post(`${this.BASE_URL}/StudentTasks`, data).toPromise();
}

getupdateTasks(params?: any): Observable<any>  {
  return this.http.post<any>(`${this.BASE_URL}/updateTasks`,params);
}
addTasks(tasks: Tasks): Observable<any> {
  return this.http.post<any>(`${this.BASE_URL}/addTasks`, tasks);
}

}

