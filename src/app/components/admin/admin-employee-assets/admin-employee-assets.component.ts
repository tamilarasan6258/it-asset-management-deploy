import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../services/assignment/assignment.service';

@Component({
  selector: 'app-admin-employee-assets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-employee-assets.component.html',
  styleUrl: './admin-employee-assets.component.css'
})
export class AdminEmployeeAssetsComponent implements OnInit {
  assets: any[] = [];
  loading = false;
  errorMsg = '';

  searchTerm: string = '';
  statusFilter: string = '';
  currentPage = 1;
  pageSize = 5;

  constructor(private assignmentService: AssignmentService) { }

  ngOnInit(): void {
    this.loading = true;
    this.assignmentService.getAllEmployeeAssignments().subscribe({
      next: (res) => {
        this.assets = res;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to fetch employee assets';
        this.loading = false;
      }
    });
  }

  formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString();
  }

  getStatus(asset: any): string {
    return asset.returnedAt ? 'returned' : 'assigned';
  }

  get filteredAssets() {
    return this.assets.filter(a => {
      const matchesSearch =
        !this.searchTerm ||
        a.asset_id?.asset_name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.asset_id?.asset_id?.toLowerCase().includes(this.searchTerm.toLowerCase()) || // ✅ include asset ID
        a.asset_category?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.assignedTo?.name?.toLowerCase().includes(this.searchTerm.toLowerCase());


      const matchesStatus =
        !this.statusFilter || this.statusFilter === this.getStatus(a);

      return matchesSearch && matchesStatus;
    });
  }

  get totalPages() {
    return Math.ceil(this.filteredAssets.length / this.pageSize);
  }

  get paginatedAssets() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAssets.slice(start, start + this.pageSize);
  }

  resetPage() {
    this.currentPage = 1;
  }
}
