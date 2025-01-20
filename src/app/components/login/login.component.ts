import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})

export class LoginComponent {
  errorMessage: string ='';
  userName: string = '';
  password: string = '';

  formBuilder = new FormBuilder().nonNullable;

  loginForm = this.formBuilder.group({
    userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.loginForm.valid) {
      const userName = this.loginForm.value.userName!;
      const password = this.loginForm.value.password!;

      this.authService.loginUser({ userName, password})
        .subscribe({
          next: (response) => {
            console.log("Login successful", response);
            localStorage.setItem('token', response.token);
            this.errorMessage = '';
            this.router.navigate(['/', 'wall']);
          },
          error: (error) => {
            this.errorMessage = error.error.message;
            console.error("Login error: ", error);
          }
        });
    } else {
      console.warn("Form is invalid");
    }
    this.loginForm.reset();
  }
}