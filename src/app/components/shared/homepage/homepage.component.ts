import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {

  ngOnInit() {
    // Add smooth scroll behavior on component initialization
    this.addScrollAnimations();
  }

  scrollToFeatures() {
    const featuresElement = document.getElementById('features');
    if (featuresElement) {
      featuresElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.handleScrollAnimations();
  }

  private addScrollAnimations() {
    // Add intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all feature cards and section elements
    setTimeout(() => {
      const animatableElements = document.querySelectorAll('.feature-card, .section-header, .cta-content');
      animatableElements.forEach(el => observer.observe(el));
    }, 100);
  }

  private handleScrollAnimations() {
    // Add header scroll effect
    const header = document.querySelector('.app-header') as HTMLElement;
    if (header) {
      const scrolled = window.scrollY > 50;
      header.style.backgroundColor = scrolled ?
        'rgba(37, 99, 235, 0.95)' :
        'var(--primary-gradient)';
      header.style.backdropFilter = scrolled ? 'blur(20px)' : 'blur(10px)';
    }
  }
}
