import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  private expressURL = 'http://localhost:1986';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.expressURL}/`);
  }

  postData(data: any): Observable<any> {
    return this.http.post(`${this.expressURL}/cantrip`, data);
  }
}
