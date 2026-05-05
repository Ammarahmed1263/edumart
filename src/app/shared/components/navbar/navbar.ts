import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);
  private elRef = inject(ElementRef);
  public cartService = inject(CartService);

  scrollProgress = signal(0);
  menuOpen = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const totalHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const currentScroll = window.scrollY;
    if (totalHeight > 0) {
      this.scrollProgress.set((currentScroll / totalHeight) * 100);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }

  currentUser = this.authService.currentUser;

  toggleMenu() {
    this.menuOpen.update((value) => !value);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  getUserInitials(): string {
    const user = this.currentUser().user;
    const name = user?.userName?.trim();
    if (name) {
      const parts = name.split(' ').filter(Boolean);
      const first = parts[0]?.[0] ?? '';
      const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : '';
      return `${first}${last}`.toUpperCase();
    }
    const email = user?.email?.trim();
    return email ? email[0].toUpperCase() : 'U';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMenu();
  }
}
