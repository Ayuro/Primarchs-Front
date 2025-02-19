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
      this.setUserFromToken(token);
    }
  }

  /** ✅ Extract user details from JWT & store them */
  private setUserFromToken(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      localStorage.setItem('userId', decodedToken.userId); // ✅ Store userId
      this.currentUserSubject.next({ userName: decodedToken.userName, userId: decodedToken.userId });
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  /** ✅ Store token & userId after login */
  loginUser(data: { userName: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        console.log('Login response:', response);  // Log response to check the token
        localStorage.setItem('token', response.token);
        this.setUserFromToken(response.token);
        this.router.navigate(['/wall']);
      })
    );
  }

  /** ✅ Returns stored `userId` */
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  /** ✅ Returns `userId` from BehaviorSubject if available */
  getLoggedInUserId(): string | null {
    const currentUser = this.currentUserSubject.getValue();
    return currentUser ? currentUser.userId : this.getUserId();
  }

  /** ✅ Check if user is logged in */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /** ✅ Logout user */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // ✅ Clear stored userId
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /** ✅ Get current user as observable */
  getCurrentUser() {
    return this.currentUserSubject.asObservable();
  }

  /** ✅ Get protected data with token */
  getProtectedData(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/protected`, { headers });
  }

  /** ✅ Navigate to a user's wall */
  navigateToWall(userId: string): void {
    this.router.navigate([`/wall/${userId}`]);
  }

  registerUser(userData: { userName: string; email: string; password: string; firstName: string; lastName: string; gender: string; age: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}
