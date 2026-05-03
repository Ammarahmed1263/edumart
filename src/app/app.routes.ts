import { Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { NotFound } from './shared/components/not-found/not-found';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { Home } from './shared/components/home/home';
export const routes: Routes = [
  { path: 'login', canActivate: [guestGuard], component: Login },
  { path: 'register', canActivate: [guestGuard], component: Register },
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: Home },
      {
        path: 'courses',
        loadComponent: () => import('./features/courses/courses').then((c) => c.Courses),
      },
      {
        path: 'cart',
        canActivate: [authGuard],
        loadComponent: () => import('./features/cart/cart').then((c) => c.Cart),
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/checkout').then((c) => c.Checkout),
      },
      {
        path: 'my-courses',
        canActivate: [authGuard],
        loadComponent: () => import('./features/my-courses/my-courses').then((c) => c.MyCourses),
      },

      { path: '**', component: NotFound },
    ],
  },
];
