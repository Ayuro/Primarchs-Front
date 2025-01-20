import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-friend-wall',
  templateUrl: './friend-wall.component.html',
  styleUrls: ['./friend-wall.component.scss']
})
export class FriendWallComponent implements OnInit {
  friendData: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const friendId = this.route.snapshot.paramMap.get('id');
    this.http.get(`http://localhost:1986/api/users/${friendId}`)
      .subscribe((data) => this.friendData = data);
  }
}
