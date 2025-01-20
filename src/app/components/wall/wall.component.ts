import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-wall',
  imports: [],
  templateUrl: './wall.component.html',
  styleUrl: './wall.component.scss'
})

export class WallComponent implements OnInit{
  userName: string = '';
  userId: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
      this.authService.getCurrentUser().subscribe((user) => {
        if (user) {
          this.userName = user.userName;
          this.userId = user.userId;
          console.log("Welcome, ", this.userName);
        }
      });
  }
}
