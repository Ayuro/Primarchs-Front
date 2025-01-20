import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // This makes the service globally available
})

export class UserService {
  private apiUrl = 'http://localhost:1986/api'; // Base URL for your backend

  constructor(private http: HttpClient) {}

  // Method to search for users
  searchUsers(query: string): Observable<{ userName: string; _id: string }[]> {
    // Send a GET request to the /users/search endpoint with the query as a parameter
    return this.http.get<{ userName: string; _id: string }[]>(
      `${this.apiUrl}/users/search`,
      { params: { query } }
    );
  }
}
