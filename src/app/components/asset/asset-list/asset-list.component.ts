import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AssetService } from '../../../services/asset/asset.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.css'
})

export class AssetListComponent {
  assets: any[] = [];
  assetCounts: any[] = [];
  loading = false;
  errorMsg = '';
  editingAsset: any = null;
  editForm!: FormGroup;
  originalAssetValue: any = null;


  // 🔍 Filtering & Search
  searchTerm: string = '';
  categoryFilter: string = '';

  // 📄 Pagination
  currentPage = 1;
  pageSize = 5;

  constructor(private assetService: AssetService, private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchAssets();
    this.fetchAssetCounts();
    this.initForm();
  }

  initForm() {
    this.editForm = this.fb.group({
      asset_name: ['', Validators.required],
      asset_category: ['', Validators.required],
      condition: ['', Validators.required],
      description: [''],
    });
  }

  fetchAssets() {
    this.loading = true;
    this.assetService.getAllAssets().subscribe({
      next: (res) => {
        this.assets = res;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = '❌ Failed to load assets';
        this.loading = false;
      },
    });
  }

  fetchAssetCounts() {
    this.assetService.getAssetCounts().subscribe({
      next: (res) => (this.assetCounts = res),
      error: () => console.error('Failed to load asset counts'),
    });
  }


  editAsset(asset: any) {
    this.editingAsset = asset;
    this.originalAssetValue = { ...asset }; // Clone original asset data

    this.editForm.patchValue({
      asset_name: asset.asset_name,
      asset_category: asset.asset_category,
      condition: asset.condition,
      description: asset.description,
    });
  }

  hasChanges(): boolean {
    if (!this.originalAssetValue || !this.editForm) return false;

    return (
      this.editForm.value.asset_name !== this.originalAssetValue.asset_name ||
      this.editForm.value.asset_category !== this.originalAssetValue.asset_category ||
      this.editForm.value.condition !== this.originalAssetValue.condition ||
      this.editForm.value.description !== this.originalAssetValue.description
    );
  }


  cancelEdit() {
    this.editingAsset = null;
  }

  // ✅ Update Form Control for inline editing
  updateFormControl(controlName: string, value: any) {
    this.editForm.get(controlName)?.setValue(value);
  }

  saveEdit() {
    if (!this.editForm.valid || !this.editingAsset) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to save the changes?',
        confirmText: 'Save',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.assetService.updateAsset(this.editingAsset._id, this.editForm.value).subscribe({
          next: () => {
            this.fetchAssets();
            this.fetchAssetCounts();
            this.editingAsset = null;
          },
          error: () => alert('❌ Failed to update asset'),
        });
      }
    });
  }

  deleteAsset(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this asset?' },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.assetService.deleteAsset(id).subscribe({
          next: () => {
            this.fetchAssets();
            this.fetchAssetCounts();
          },
          error: () => alert('❌ Failed to delete asset'),
        });
      }
    });
  }

  // ✅ Filtering logic
  get filteredAssets() {
    return this.assets.filter(a => {
      const matchesSearch =
        !this.searchTerm ||
        a.asset_name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.asset_id?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory =
        !this.categoryFilter || a.asset_category === this.categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }

  // ✅ Pagination logic
  get totalPages() {
    return Math.ceil(this.filteredAssets.length / this.pageSize);
  }

  get paginatedAssets() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredAssets.slice(startIndex, startIndex + this.pageSize);
  }

  resetPage() {
    this.currentPage = 1;
  }
}

