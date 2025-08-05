import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { AuthUser } from '../../../models/auth.model';
import { AuthService } from '../../../services/auth/auth.service';


@Component({
  selector: 'app-depthead-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './depthead-dashboard.component.html',
  styleUrl: './depthead-dashboard.component.css'
})
export class DeptheadDashboardComponent {
  user: AuthUser | null;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser(); // get user info
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
