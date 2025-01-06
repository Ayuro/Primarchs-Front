import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

export class LoginComponent {

  formBuilder = new FormBuilder().nonNullable;

  form = this.formBuilder.group({
    userName: new FormControl('', [Validators.required, Validators.minLength(4),]),
    password: new FormControl('', [Validators.required, Validators.minLength(6),]),
  });

  sendData() {
    if (this.form.valid) {
      const data = { ...this.form.value, page: 'login' };
      this.form.reset();
    }
  }

  get userName() {
    return this.form.controls.userName;
  }

  get password() {
    return this.form.controls.password;
  }
}