import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';


export const loginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    const role = auth.getUser()?.role;
    if (role === 'admin') router.navigate(['/admin']);
    else if (role === 'depthead') router.navigate(['/depthead']);
    else if (role === 'employee') router.navigate(['/employee']);
    else router.navigate(['/']);
    // router.navigate(['/admin']);
    return false;
  }
  return true;
};
