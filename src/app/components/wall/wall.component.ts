import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FetchFriendsService } from '../../services/fetch-friends.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface WallPost {
  content: string;
  createdAt: string;
  userId?: { userName: string };
}

interface FriendRequestResponse {
  message: string;
  friendRequests: { userName: string; _id: string }[];
}

@Component({
  selector: 'app-wall',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wall.component.html',
  styleUrl: './wall.component.scss'
})

export class WallComponent implements OnInit{
  userName: string = '';
  userId: string = '';
  newMessage: string = '';
  posts: WallPost[] = [];
  searchQuery: string = '';
  searchResults: any[] = [];
  loggedInUserId: string | null = null;
  friends: { userName: string; _id: string }[] = [];
  friendRequests: { userName: string; _id: string }[] = [];

  constructor(private authService: AuthService, private http: HttpClient, private router: Router, private fetchFriendsService: FetchFriendsService) {}

  ngOnInit(): void {
    this.loggedInUserId = this.authService.getLoggedInUserId();

    if (this.loggedInUserId) {
      this.loadFriendRequests();
      this.loadFriends();
    }

    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userName = user.userName;
        this.userId = user.userId;
        this.loadWallPosts();
      }
    });
  }

  toProfile() {
    this.router.navigate(['/profil']);
  }

  /** Search Users */

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.http.get('http://localhost:1986/api/users/search', { params: { query: this.searchQuery}})
      .subscribe((results: any) => {
        this.searchResults = results.map((user: any) => ({
          ...user,
          isFriend: false
        }));
      });
    } else {
      this.searchResults = [];
    }
  }

  /** Friends management */

  sendFriendRequest(userId: string): void {
    const requesterId = localStorage.getItem('userId');
    this.http.post('http://localhost:1986/api/friends/request', { requesterId, recipientId: userId })
    .subscribe({
      next: () => alert('Friend request sent!'),
      error: (err) => console.error('error sending friend request: ', err)
    });
  }
  
  loadFriends(): void {
    if (!this.loggedInUserId) return;
    this.fetchFriendsService.getFriends(this.loggedInUserId).subscribe({
      next: (friends) => this.friends = friends,
      error: (error) => console.error('Error fetching friends: ', error),
    });
  }

  loadFriendRequests(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    console.log('Sending request for friend requests:', this.loggedInUserId);
    this.http.get<FriendRequestResponse>(`http://localhost:1986/api/friends/requests/${this.loggedInUserId}`, { headers })
      .subscribe({
        next: (response) => {
          console.log('Fetching friend requests for:', this.loggedInUserId);

          if (response && response.friendRequests) {
            this.friendRequests = response.friendRequests;
          } else {
            console.error('Unexpected response format:', response);
          }
        },
        error: (err) => {
          console.error('Error loading friend requests:', err);
          // Log more details to check what's going wrong
          if (err instanceof HttpErrorResponse) {
            console.error('Error status:', err.status);
            console.error('Error message:', err.message);
          }
        }        
      });
    }

  acceptFriendRequest(requesterId: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    this.http.put<{ message: string }>(
      'http://localhost:1986/api/friends/accept',
      { userId: this.loggedInUserId, requesterId },
      { headers }
    ).subscribe({
      next: (response) => {
        alert(response.message);
        this.loadFriendRequests();
        this.loadFriends();
      },
      error: (err) => console.error('Error accepting friend request:', err)
    });
  }

  rejectFriendRequest(requesterId: string): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.put('http://localhost:1986/api/friends/reject', 
      { userId: this.loggedInUserId, requesterId }, 
      { headers }
    ).subscribe({
      next: (response) => {
        const res = response as FriendRequestResponse;
        alert(res.message);
        this.loadFriendRequests();
      },
      error: (err) => console.error('Error rejecting friend request:', err)
    });
  }

  viewFriendWall(userId: string): void {
    this.authService.navigateToWall(userId);
  }

  /** Post a new message */

  postMessage() {
    if (!this.newMessage.trim()) return;
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found');
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    this.http.post('http://localhost:1986/api/wall/post', 
      { userId: this.userId, content: this.newMessage }, 
      { headers }
    ).subscribe({
      next: (post: any) => {
        this.newMessage = '';
        this.loadWallPosts();
      },
      error: (err) => console.error('Error posting message:', err)
    });
  }

  /** Load & display posts */

  loadWallPosts(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any[]>('http://localhost:1986/api/wall/posts', {headers})
    .subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (err) => console.error('Error loading posts:', err)
    });
  }
}
