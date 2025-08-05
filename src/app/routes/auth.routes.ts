import { Routes } from '@angular/router';
import { LoginComponent } from '../components/shared/login/login.component';
import { ForgotPasswordComponent } from '../components/shared/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../components/shared/reset-password/reset-password.component';
import { HomepageComponent } from '../components/shared/homepage/homepage.component';
import { loginGuard } from '../guards/login.guard';

export const authRoutes: Routes = [
  { path: '', component: HomepageComponent, canActivate: [loginGuard] },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [loginGuard] },
  { path: 'reset-password/:token', component: ResetPasswordComponent, canActivate: [loginGuard] },
];
