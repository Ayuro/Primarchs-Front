import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class FetchFriendsService {
  private apiUrl = 'http://localhost:1986/api';

  constructor(private http: HttpClient) { }

  getFriends(userId: string): Observable<{ userName: string; _id: string }[]>{
    return this.http.get<{ userName: string; _id: string }[]>(`${this.apiUrl}/friends/${userId}`);
  }
}
