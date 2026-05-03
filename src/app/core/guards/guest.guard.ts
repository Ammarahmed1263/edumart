import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './../services/auth.service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If they are ALREADY logged in, redirect them to courses. Otherwise, let them see the login page (true).
  return authService.isLoggedIn() ? router.createUrlTree(['/courses']) : true;
};
