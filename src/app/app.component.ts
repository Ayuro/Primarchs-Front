import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CrudService } from './services/crud.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private crud:CrudService){}

postData: any = {
  str: "Secret"
};

  getItems() {
    this.crud.getAll().subscribe((data) => {
      console.log(data);
    });
  }

  sendData() {
    this.crud.postData(this.postData).subscribe((response) => {
      console.log(response);
    })
  }

  title = 'primarchs-front';
}
