import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})

export class RegisterComponent {
  userName: string = '';
  password: string = '';
  errorMessage: string = '';

  formBuilder = new FormBuilder().nonNullable;

  form = this.formBuilder.group({
    userName: new FormControl('', [Validators.required, Validators.minLength(4),]),
    password: new FormControl('', [Validators.required, Validators.minLength(6),]),
  });

  constructor(private authService: AuthService) {}

  onRegister() {
    if (this.form.valid) {
      const userName = this.form.value.userName!;
      const password = this.form.value.password!;
  
      this.authService.registerUser({ userName, password })
        .subscribe({
          next: (response) => {
            console.log('User registered successfully:', response);
            this.form.reset();
          },
          error: (error) => {
            this.errorMessage = error.error.message;
            console.error('Registration error:', error);
            this.form.reset();
          }
        });
    } else {
      console.warn('Form is invalid');
    }
  }
}
