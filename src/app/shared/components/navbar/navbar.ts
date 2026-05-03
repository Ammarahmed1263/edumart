import { Component, inject, HostListener, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  // Inject the service
  private authService = inject(AuthService);
  private router = inject(Router);
  
  scrollProgress = signal(0);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const currentScroll = window.scrollY;
    if (totalHeight > 0) {
      this.scrollProgress.set((currentScroll / totalHeight) * 100);
    }
  }

  // Expose the signal to the template so it updates automatically!
  currentUser = this.authService.currentUser;

  logout() {
    this.authService.logout();
    this.router.navigate(['/my-courses']);
  }
}
