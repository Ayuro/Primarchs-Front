import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

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
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  gender: string = '';
  age: string = '';
  errorMessage: string = '';

  formBuilder = new FormBuilder().nonNullable;

  form = this.formBuilder.group({
    userName: new FormControl('', [Validators.required, Validators.minLength(4),]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6),]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    gender: new FormControl(''),
    age: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router) {}
  
  onRegister() {
    if (this.form.valid) {
      const requestData = {
        userName: this.form.value.userName!,
        email: this.form.value.email!,
        password: this.form.value.password!,
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        gender: this.form.value.gender!,
        age: this.form.value.age!,
      }

      this.authService.registerUser(requestData)
        .subscribe({
          next: (response) => {
            console.log('User registered successfully:', response);
            this.form.reset();
            this.router.navigate(['/', 'login']);
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
