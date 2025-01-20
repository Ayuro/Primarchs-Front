import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:1986/api';
  private currentUserSubject = new BehaviorSubject<{ userName: string; userId: string } | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.currentUserSubject.next({ userName: decodedToken.userName, userId: decodedToken.userId });
    }
  }

  registerUser(userData: { userName: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  loginUser(data: { userName: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        const decodedToken: any = jwtDecode(response.token);
        localStorage.setItem('token', response.token); // Store token
        this.currentUserSubject.next({ userName: decodedToken.userName, userId: decodedToken.userId }); // Set current user
        this.router.navigate(['/wall']); // Navigate to wall
      })
    );
  }

  getCurrentUser() {
    return this.currentUserSubject.asObservable(); // Return an observable of current user
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getProtectedData(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/protected`, { headers });
  }
  
  navigateToWall(userId: string): void {
    this.router.navigate([`/wall/${userId}`])
  }

  getLoggedInUserId(): string | null {
    const currentUser = this.currentUserSubject.getValue();
    return currentUser ? currentUser.userId : null; // Return userId if available, else null
  }
}


function jwt_decode(token: any) {
  throw new Error('Function not implemented.');
}

