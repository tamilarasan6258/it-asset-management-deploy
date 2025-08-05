import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { roleGuard } from './role.guard';

describe('roleGuard', () => {
  it('should return true for allowed role', () => {
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = {} as RouterStateSnapshot;

    const guardFn = roleGuard('admin'); // returns a CanActivateFn

    const result = TestBed.runInInjectionContext(() => guardFn(mockRoute, mockState));
    expect(result).toBeTrue(); // or your expected result
  });
});
