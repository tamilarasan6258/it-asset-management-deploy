import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const roleGuard = (expectedRole: 'admin' | 'depthead' | 'employee'): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const user = auth.getUser();

    if (user && user.role === expectedRole) {
      return true;
    }

    router.navigate(['/login']);
    return false;
  };
};
