import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { AdminDashboardComponent } from '../components/admin/admin-dashboard/admin-dashboard.component';
import { CreateUserComponent } from '../components/user/create-user/create-user.component';
import { CreateAssetComponent } from '../components/asset/create-asset/create-asset.component';
import { AssetListComponent } from '../components/asset/asset-list/asset-list.component';
import { AdminReviewRequestsComponent } from '../components/admin/admin-review-requests/admin-review-requests.component';
import { AssignAssetComponent } from '../components/admin/assign-asset/assign-asset.component';
import { AdminReturnRequestsComponent } from '../components/admin/admin-return-requests/admin-return-requests.component';
import { AdminEmployeeAssetsComponent } from '../components/admin/admin-employee-assets/admin-employee-assets.component';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard('admin')],
    children: [
      { path: 'create-user', component: CreateUserComponent },
      { path: 'create-asset', component: CreateAssetComponent },
      { path: 'asset-list', component: AssetListComponent },
      { path: 'admin-review-requests', component: AdminReviewRequestsComponent },
      { path: 'assign-asset', component: AssignAssetComponent },
      { path: 'admin-return-requests', component: AdminReturnRequestsComponent },
      { path: 'employee-assets', component: AdminEmployeeAssetsComponent }
    ]
  }
];
