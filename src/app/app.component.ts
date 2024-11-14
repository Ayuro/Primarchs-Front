import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  message: string = '';
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.apiService.getMessage().subscribe(
      (data: any) => {
        this.message = data;
      },
      (error: any) => {
        console.error('An error occurred:', error);
      }
    );
  }
  title = 'Primachs-Front';
}
