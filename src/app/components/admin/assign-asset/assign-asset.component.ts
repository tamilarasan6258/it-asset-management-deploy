
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestService } from '../../../services/request/request.service';
import { AssignmentService } from '../../../services/assignment/assignment.service';
import { AssetService } from '../../../services/asset/asset.service';


@Component({
  selector: 'app-assign-asset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './assign-asset.component.html',
  styleUrl: './assign-asset.component.css'
})
export class AssignAssetComponent {
  approvedRequests: any[] = [];
  selectedAssets: { [key: string]: string } = {};
  availableAssets: { [key: string]: any[] } = {};
  filteredAssets: { [key: string]: any[] } = {};
  showDropdown: { [key: string]: boolean } = {};
  assetErrors: { [key: string]: string } = {};


  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private requestService: RequestService,
    private assignmentService: AssignmentService,
    private assetservice: AssetService
  ) { }

  ngOnInit(): void {
    this.loadApprovedRequests();
  }

  loadApprovedRequests() {
    this.loading = true;
    this.requestService.getAdminApprovedRequests().subscribe({
      next: res => {
        const filteredRequests: any[] = [];
        const fetchTasks = res.map((req: any) => {
          return new Promise<void>((resolve) => {
            this.assetservice.getAvailableAssetsByCategory(req.asset_category).subscribe({
              next: (assets) => {
                if (assets.length > 0) {
                  filteredRequests.push(req);
                  this.availableAssets[req._id] = assets;
                  this.filteredAssets[req._id] = assets;
                }
                resolve();
              },
              error: () => {
                this.availableAssets[req._id] = [];
                resolve();
              }
            });
          });
        });

        Promise.all(fetchTasks).then(() => {
          this.approvedRequests = filteredRequests;
          this.loading = false;
        });
      },
      error: () => {
        this.errorMsg = '❌ Failed to load approved requests';
        this.loading = false;
      }
    });
  }

  onSearch(requestId: string, query: string) {
    const allAssets = this.availableAssets[requestId] || [];
    this.filteredAssets[requestId] = allAssets.filter(a =>
      a.asset_id.toLowerCase().includes(query.toLowerCase())
    );
  }

  handleSearch(event: Event, requestId: string) {
    const input = event.target as HTMLInputElement;
    const query = input?.value || '';
    this.onSearch(requestId, query);
  }

  selectAsset(requestId: string, asset: any) {
    this.selectedAssets[requestId] = asset._id;
    this.showDropdown[requestId] = false;
  }

  hideDropdown(requestId: string) {
    setTimeout(() => this.showDropdown[requestId] = false, 200);
  }

  getAssetLabel(requestId: string, assetId: string): string {
    const asset = this.availableAssets[requestId]?.find(a => a._id === assetId);
    return asset ? `${asset.asset_id} (${asset.condition})` : '';
  }

  assignAsset(requestId: string) {
    const assetId = this.selectedAssets[requestId];
    if (!assetId) {
      this.assetErrors[requestId] = '❗ Please select an asset';
      return;
    }

    this.assetErrors[requestId] = ''; // Clear previous errors

    this.assignmentService.assignAsset(requestId, assetId).subscribe({
      next: () => {
        this.successMsg = '✅ Asset assigned successfully';
        this.loadApprovedRequests();
      },
      error: () => {
        alert('❌ Assignment failed');
      }
    });
  }
}
