import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss',
})

export class ProfilComponent implements OnInit {
  profilForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  user: any;
  isEditing: boolean = false;
  editableField: string | null = null; // Track the editable field

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) {
    this.profilForm = this.fb.group({
      userName: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl(''),
      lastName: new FormControl('', [Validators.required]),
      gender: new FormControl(''),
      age: new FormControl('', [Validators.required]),
    });
  }

  toWall() {
    this.router.navigate(['/wall']);
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId) {
      this.http.get(`http://localhost:1986/api/profil/${userId}`).subscribe({
        next: (user: any) => {
          this.user = user;
          this.profilForm.patchValue(user);
        },
        error: (err) => {
          console.error('Error loading profile:', err);
          this.errorMessage = 'Failed to load user data';
        },
      });
    }
  }

  editProfile(field: string): void {
    this.isEditing = true;
    this.editableField = field;
  }

  updateProfil(): void {
    if (this.profilForm.valid) {
        const token = localStorage.getItem('token');
        if (!token) {
            this.errorMessage = 'User is not authenticated';
            return;
        }

        this.http.put('http://localhost:1986/api/profil', this.profilForm.value, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).subscribe({
            next: (response: any) => {
                this.successMessage = 'Profile updated successfully!';
                this.isEditing = false;
                this.loadUserProfile();
            },
            error: (err) => {
                console.error('Update failed:', err);
                this.errorMessage = 'Profile update failed';
            },
        });
    }
  }
}
