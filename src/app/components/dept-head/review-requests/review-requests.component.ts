import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService } from '../../../services/request/request.service';

@Component({
  selector: 'app-review-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-requests.component.html',
  styleUrl: './review-requests.component.css'
})
export class ReviewRequestsComponent implements OnInit {

  requests: any[] = [];
  loading = false;
  errorMsg = '';

  // Filter/Search/Pagination
  searchTerm: string = '';
  statusFilter: string = '';
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests() {
    this.loading = true;
    this.requestService.getDeptHeadRequests().subscribe({
      next: (res) => {
        this.requests = res;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = '❌ Failed to load requests';
        this.loading = false;
      }
    });
  }

  updateStatus(id: string, status: 'approved' | 'rejected') {
    this.requestService.updateRequestStatus(id, status).subscribe({
      next: () => {
        this.requests = this.requests.map(req =>
          req._id === id ? { ...req, status } : req
        );
      },
      error: () => {
        alert('❌ Failed to update request status');
      }
    });
  }

  sendToAdmin(id: string) {
    this.requestService.forwardToAdmin(id).subscribe({
      next: () => {
        this.requests = this.requests.map(r =>
          r._id === id ? { ...r, forwardedToAdmin: true } : r
        );
      },
      error: () => {
        alert('❌ Failed to forward request to admin');
      }
    });
  }

  // Filtered results
  get filteredRequests() {
    return this.requests.filter(r => {
      const searchMatch = !this.searchTerm || r.asset_category?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.reason?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.user?.name?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const statusMatch = !this.statusFilter || r.status === this.statusFilter;

      return searchMatch && statusMatch;
    });
  }

  get totalPages() {
    return Math.ceil(this.filteredRequests.length / this.pageSize);
  }

  get paginatedRequests() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRequests.slice(start, start + this.pageSize);
  }

  resetPage() {
    this.currentPage = 1;
  }
}
