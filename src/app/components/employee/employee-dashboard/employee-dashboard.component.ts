import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { AuthService } from '../../../services/auth/auth.service';
import { AuthUser } from '../../../models/auth.model';


@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent {
  user: AuthUser | null;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser(); // 👈 retrieve user info
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
