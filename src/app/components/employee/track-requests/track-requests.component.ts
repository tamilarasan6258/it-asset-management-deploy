import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestData } from '../../../models/request.model';
import { RequestService } from '../../../services/request/request.service';

@Component({
  selector: 'app-track-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './track-requests.component.html',
  styleUrl: './track-requests.component.css'
})

export class TrackRequestsComponent implements OnInit {
  requests: RequestData[] = [];
  loading = false;
  errorMsg = '';
  page = 1;
  totalPages = 1;
  searchTerm = '';
  statusFilter = '';

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.fetchMyRequests();
  }

  fetchMyRequests() {
    this.loading = true;
    this.requestService.getMyRequests(this.page, 5, this.searchTerm, this.statusFilter).subscribe({
      next: (res) => {
        console.log(res);
        this.requests = res.requests;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => {
        this.errorMsg = '❌ Failed to load requests';
        this.loading = false;
      },
    });
  }

  goToPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.fetchMyRequests();
    }
  }

  onSearchChange() {
    this.page = 1; // Reset to first page
    this.fetchMyRequests();
  }

  getDisplayStatus(req: RequestData): string {
    if ((req.status === 'rejected') || (req.adminStatus === 'rejected')) {
      return 'Rejected';
    }
    if (req.status === 'approved' && req.adminStatus === 'approved') {
      return req.completed ? 'Approved' : 'Processing';
    }
    return 'Pending';
  }
}

