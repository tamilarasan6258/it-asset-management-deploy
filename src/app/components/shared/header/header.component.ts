import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() role: 'admin' | 'employee' | 'depthead' | 'guest' = 'guest';
  isMobileMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) { }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.updateBodyScrollState();
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.updateBodyScrollState();
  }

  private updateBodyScrollState() {
    if (typeof document !== 'undefined') {
      const body = document.body;
      if (this.isMobileMenuOpen) {
        body.classList.add('mobile-menu-open');
      } else {
        body.classList.remove('mobile-menu-open');
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu();
  }

  get user() {
    return this.authService.getUser();
  }

  // Close mobile menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const mobileMenu = document.querySelector('.role-nav');
    const toggleButton = document.querySelector('.mobile-menu-toggle');

    if (this.isMobileMenuOpen &&
      mobileMenu &&
      toggleButton &&
      !mobileMenu.contains(target) &&
      !toggleButton.contains(target)) {
      this.closeMobileMenu();
    }
  }

  // Close mobile menu on window resize if screen becomes larger
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768) {
      this.closeMobileMenu();
    }
  }
}
