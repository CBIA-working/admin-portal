import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StudentService {
    getData() {
        return [

        ];
    }

    constructor(private http: HttpClient) {}
    

    getStudents(params?: any) {
        return this.http.get<any>('https://maui-portal.vercel.app/api/getUsers', { params: params }).toPromise();
    }
};