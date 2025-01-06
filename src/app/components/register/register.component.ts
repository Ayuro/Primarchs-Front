import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/user-registration.service';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})

export class RegisterComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  formBuilder = new FormBuilder().nonNullable;

  form = this.formBuilder.group({
    userName: new FormControl('', [Validators.required, Validators.minLength(4),]),
    password: new FormControl('', [Validators.required, Validators.minLength(6),]),
  });

  constructor(private authService: AuthService) {}

  onRegister() {
    this.authService.registerUser({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
        },
        error: (error) => {
          this.errorMessage = error.error.message;
          console.error('Registration error:', error);
        }
      });
  }
}

// export class RegisterComponent {

//   formBuilder = new FormBuilder().nonNullable;

//   form = this.formBuilder.group({
//     userName: new FormControl('', [Validators.required, Validators.minLength(4),]),
//     password: new FormControl('', [Validators.required, Validators.minLength(6),]),
//   });

//   sendData() {
//     if (this.form.valid) {
//       const data = { ...this.form.value, page: 'register' };
//       this.form.reset();
//     }
//   }

//   get userName() {
//     return this.form.controls.userName;
//   }

//   get password() {
//     return this.form.controls.password;
//   }
// }