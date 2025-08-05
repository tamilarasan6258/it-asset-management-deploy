import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RequestService } from '../../../services/request/request.service';

@Component({
  selector: 'app-admin-review-requests',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-review-requests.component.html',
  styleUrl: './admin-review-requests.component.css'
})
export class AdminReviewRequestsComponent {

  requests: any[] = [];
  loading = false;
  errorMsg = '';
  remarkForms: { [key: string]: FormGroup } = {};
  summary: any[] = [];
  summaryErrorMsg = '';
  summaryLoading = false;

  constructor(
    private requestService: RequestService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.loadRequests();
    this.loadAssetSummary(); // 👉 fetch summary on init
  }

  loadAssetSummary() {
    this.summaryLoading = true;
    this.requestService.getRequestAssetSummary().subscribe({
      next: (res) => {
        this.summary = res;
        this.summaryLoading = false;
      },
      error: () => {
        this.summaryErrorMsg = 'Failed to load asset category summary';
        this.summaryLoading = false;
      }
    });
  }
  loadRequests() {
    this.loading = true;
    this.requestService.getDeptHeadForwardedRequests().subscribe({
      next: (res) => {

        this.requests = res;
        this.loading = false;
        this.requests.forEach((r) => {
          this.remarkForms[r._id] = this.fb.group({
            remark: ['']
          });
        });

      },
      error: () => {
        this.errorMsg = 'Failed to load forwarded requests';
        this.loading = false;
      }
    });
  }

  reviewRequest(id: string, status: 'approved' | 'rejected') {
    const remark = this.remarkForms[id].value.remark;
    this.requestService.reviewRequestByAdmin(id, status, remark).subscribe({
      next: () => {
        const req = this.requests.find(r => r._id === id);
        if (req) {
          req.adminStatus = status;
          req.adminRemarks = remark;
        }
        this.loadAssetSummary();
      },
      error: () => {
        alert('❌ Failed to update admin review');
      }
    });
  }
}
