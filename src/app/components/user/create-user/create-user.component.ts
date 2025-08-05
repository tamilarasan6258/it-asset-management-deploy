import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {

  userForm: FormGroup;
  successMsg = '';
  errorMsg = '';
  loading = false;

  constructor(private fb: FormBuilder, private userService: UserService) {

    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]{3,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        ]
      ],
      role: ['', Validators.required],
      department: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]]
    });

  }

  onSubmit() {
    if (this.userForm.invalid) return;

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    console.log(this.userForm.value);
    this.userService.createUser(this.userForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = 'User created successfully ✅';
        this.userForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Failed to create user ❌';
      },
    });
  }
}
