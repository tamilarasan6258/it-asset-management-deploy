import { Routes } from '@angular/router';
import { authRoutes } from './routes/auth.routes';
import { adminRoutes } from './routes/admin.routes';
import { deptheadRoutes } from './routes/depthead.routes';
import { employeeRoutes } from './routes/employee.routes';

export const routes: Routes = [
  ...authRoutes,
  ...adminRoutes,
  ...deptheadRoutes,
  ...employeeRoutes,
  { path: '**', redirectTo: '' }
];
