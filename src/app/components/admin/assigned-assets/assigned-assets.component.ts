import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentService } from '../../../services/assignment/assignment.service';
import { AuthService } from '../../../services/auth/auth.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';




@Component({
  selector: 'app-assigned-assets',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './assigned-assets.component.html',
  styleUrl: './assigned-assets.component.css'
})
export class AssignedAssetsComponent {

  assignments: any[] = [];
  loading = false;
  successMsg = '';
  errorMsg = '';
  searchTerm: string = '';
  statusFilter: string = '';
  currentPage = 1;
  pageSize = 5; // 👈 Items per page (adjust as needed)

  constructor(
    private assignmentService: AssignmentService,
    private authService: AuthService, private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchAssignedAssets();
  }

  get totalPages() {
    return Math.ceil(this.filteredAssignments.length / this.pageSize);
  }

  get paginatedAssignments() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredAssignments.slice(startIndex, startIndex + this.pageSize);
  }


  fetchAssignedAssets() {
    this.loading = true;
    this.assignmentService.getMyAssignments().subscribe({
      next: (res) => {

        console.log("Assignments fetched successfully:", res);
        this.assignments = res;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = 'Failed to load assigned assets.';
        this.loading = false;
      },
    });
  }

  formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString();
  }


  get filteredAssignments() {
    return this.assignments.filter(a => {
      const matchesSearch = !this.searchTerm ||
        a.asset_id?.asset_name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        a.asset_category?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const status = this.getStatus(a);
      const matchesStatus = !this.statusFilter || this.statusFilter === status;

      return matchesSearch && matchesStatus;
    });
  }

  resetPage() {
    this.currentPage = 1;
  }


  getStatus(item: any): string {
    if (item.returnedAt) return 'returned';
    if (item.returnRequested) return 'requested';
    return 'active';
  }

  requestReturn(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to request asset return?',
        confirmText: 'Yes',
        cancelText: 'No'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.assignmentService.requestReturn(id).subscribe({
          next: () => {
            this.successMsg = '✅ Return request submitted';
            this.errorMsg = '';

            const assignment = this.assignments.find(a => a._id === id);
            if (assignment) assignment.returnRequested = true;

            setTimeout(() => (this.successMsg = ''), 3000);
          },
          error: () => {
            this.successMsg = '';
            this.errorMsg = '❌ Failed to request return';
            setTimeout(() => (this.errorMsg = ''), 3000);
          }
        });
      }
    });
  }
}
