import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';
import { EmployeeDashboardComponent } from '../components/employee/employee-dashboard/employee-dashboard.component';
import { AssignedAssetsComponent } from '../components/admin/assigned-assets/assigned-assets.component';
import { RequestAssetComponent } from '../components/employee/request-asset/request-asset.component';
import { TrackRequestsComponent } from '../components/employee/track-requests/track-requests.component';

export const employeeRoutes: Routes = [
  {
    path: 'employee',
    component: EmployeeDashboardComponent,
    canActivate: [authGuard, roleGuard('employee')],
    children: [
      { path: 'assigned-assets', component: AssignedAssetsComponent },
      { path: 'request-asset', component: RequestAssetComponent },
      { path: 'track-requests', component: TrackRequestsComponent }
    ]
  }
];
