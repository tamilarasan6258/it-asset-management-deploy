import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  form: FormGroup;
  success = '';
  error = '';
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.success = '';
    this.authService.forgotPassword(this.form.value.email).subscribe({
      next: () => {
        console.log("1");
        this.success = 'Reset link sent to your email.';
        this.error = '';
        this.loading = false; 
      },
      error: (err) => {
        console.log("2")
        this.error = err.error?.message || 'Failed to send reset email.';
        this.success = '';
        this.loading = false; 
      },
    });
  }
}
