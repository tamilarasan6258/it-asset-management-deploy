import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssetService } from '../../../services/asset/asset.service';

@Component({
  selector: 'app-create-asset',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-asset.component.html',
  styleUrl: './create-asset.component.css'
})
export class CreateAssetComponent {

  assetForm: FormGroup;
  successMsg = '';
  errorMsg = '';
  loading = false;

  constructor(private fb: FormBuilder, private assetService: AssetService) {
    this.assetForm = this.fb.group({
      asset_name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9\s\-]{3,}$/) // allows letters, numbers, space, dash
        ]
      ],
      asset_id: [
        '',
        [
          Validators.required,
        ]
      ],
      asset_category: ['', Validators.required],
      condition: ['', Validators.required],
      description: ['', [Validators.maxLength(200)]]
    });

  }

  onSubmit() {
    if (this.assetForm.invalid) return;

    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    console.log(this.assetForm.value);
    this.assetService.createAsset(this.assetForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = '✅ Asset created successfully';
        this.assetForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || '❌ Failed to create asset';
      },
    });
  }
}
