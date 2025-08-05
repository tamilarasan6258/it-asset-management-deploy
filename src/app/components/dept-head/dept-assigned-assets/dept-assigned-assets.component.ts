import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../services/assignment/assignment.service';

@Component({
  selector: 'app-dept-assigned-assets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dept-assigned-assets.component.html',
  styleUrl: './dept-assigned-assets.component.css'
})
export class DeptAssignedAssetsComponent implements OnInit {
  assignments: any[] = [];
  loading = false;
  errorMsg = '';

  // 🔍 Search and filter
  searchTerm: string = '';
  statusFilter: string = '';

  // 📄 Pagination
  currentPage = 1;
  pageSize = 5;

  constructor(private assignmentService: AssignmentService) { }

  ngOnInit(): void {
    this.fetchDeptAssignedAssets();
  }

  fetchDeptAssignedAssets() {
    this.loading = true;
    this.assignmentService.getAllDeptAssignments().subscribe({
      next: (res) => {
        this.assignments = res;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = '❌ Failed to load department assets';
        this.loading = false;
      }
    });
  }

  formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString();
  }

  get filteredAssignments() {
    return this.assignments.filter(a => {
      const matchesSearch =
        !this.searchTerm ||
        a.asset_id?.asset_name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.asset_category?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.assignedTo?.name?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const status = a.returnedAt ? 'returned' : 'assigned';
      const matchesStatus = !this.statusFilter || status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  get paginatedAssignments() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAssignments.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredAssignments.length / this.pageSize);
  }

  resetPage() {
    this.currentPage = 1;
  }
}
