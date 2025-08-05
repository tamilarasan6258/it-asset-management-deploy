import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { DeptheadDashboardComponent } from '../components/dept-head/depthead-dashboard/depthead-dashboard.component';
import { ReviewRequestsComponent } from '../components/dept-head/review-requests/review-requests.component';
import { DeptAssignedAssetsComponent } from '../components/dept-head/dept-assigned-assets/dept-assigned-assets.component';
import { DeptReturnReviewComponent } from '../components/dept-head/dept-return-review/dept-return-review.component';

export const deptheadRoutes: Routes = [
  {
    path: 'depthead',
    component: DeptheadDashboardComponent,
    canActivate: [authGuard, roleGuard('depthead')],
    children: [
      { path: 'review-requests', component: ReviewRequestsComponent },
      { path: 'dept-assigned-assets', component: DeptAssignedAssetsComponent },
      { path: 'dept-return-review', component: DeptReturnReviewComponent }
    ]
  }
];
