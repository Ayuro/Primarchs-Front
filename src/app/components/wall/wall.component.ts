import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FetchFriendsService } from '../../services/fetch-friends.service';

@Component({
  selector: 'app-wall',
  imports: [],
  templateUrl: './wall.component.html',
  styleUrl: './wall.component.scss'
})

export class WallComponent implements OnInit{
  userName: string = '';
  userId: string = '';
  searchQuery: string = '';
  searchResults: any[] = [];
  loggedInUserId: string | null = null;
  friends: { userName: string; _id: string }[] = [];

  constructor(private authService: AuthService, private http: HttpClient, private fetchFriendsService: FetchFriendsService) {}

  ngOnInit(): void {
      this.loggedInUserId = this.authService.getLoggedInUserId();
      if (this.loggedInUserId) {
        this.loadFriends();
      }
      this.authService.getCurrentUser().subscribe((user) => {
        if (user) {
          this.userName = user.userName;
          this.userId = user.userId;
          console.log("Welcome, ", this.userName);
        }
      });
  }

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

  viewFriendWall(userId: string): void {
    this.authService.navigateToWall(userId);
  }

}
