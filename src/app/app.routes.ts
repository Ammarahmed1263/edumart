import { Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { NotFound } from './shared/components/not-found/not-found';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { HomePage } from './pages/home/home';

export const routes: Routes = [
  { path: 'login', canActivate: [guestGuard], component: Login },
  { path: 'register', canActivate: [guestGuard], component: Register },
  {
    path: '',
    component: Layout,
    children: [
      { path: '', pathMatch: 'full', component: HomePage },
      {
        path: 'courses',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/courses/courses.component').then((c) => c.CoursesComponent),
      },
      {
        path: 'categories',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/categories-page/categories-page').then((c) => c.CategoriesPage),
      },
      {
        path: 'courses/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/course-detail/course-detail.component').then(
            (c) => c.CourseDetailComponent,
          ),
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/checkout/checkout/checkout').then((c) => c.Checkout),
      },
      {
        path: 'checkout/success',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/success/success').then((c) => c.Success),
      },
      {
        path: 'checkout/cancel',
        canActivate: [authGuard],
        loadComponent: () => import('./features/checkout/cancel/cancel').then((c) => c.Cancel),
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
