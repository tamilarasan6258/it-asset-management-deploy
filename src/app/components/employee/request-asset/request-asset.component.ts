import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../../services/request/request.service';

@Component({
  selector: 'app-request-asset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request-asset.component.html',
  styleUrl: './request-asset.component.css'
})
export class RequestAssetComponent {

  requestForm: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private requestService: RequestService) {
    this.requestForm = this.fb.group({
      asset_category: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    if (this.requestForm.invalid) return;

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.requestService.createRequest(this.requestForm.value).subscribe({
      next: () => {
        this.successMsg = '✅ Asset request submitted successfully.';
        this.requestForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || '❌ Failed to submit request.';
        this.loading = false;
      },
    });
  }
}
