import { Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { NotFound } from './shared/components/not-found/not-found';
import { HomePage } from './pages/home/home';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((c) => c.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((c) => c.Register),
  },

  {
    path: '',
    component: Layout,
    children: [
      { path: '', pathMatch: 'full', component: HomePage },

      {
        path: 'courses',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/courses/courses.component').then((c) => c.CoursesComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/course-detail/course-detail.component').then(
                (c) => c.CourseDetailComponent,
              ),
          },
        ],
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories-page/categories-page').then((c) => c.CategoriesPage),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./features/checkout/checkout/checkout').then((c) => c.Checkout),
      },
      {
        path: '',
        canActivateChild: [authGuard],
        children: [
          {
            path: 'my-courses',
            loadComponent: () =>
              import('./features/my-courses/my-courses').then((c) => c.MyCourses),
          },
          {
            path: 'checkout/success',
            loadComponent: () =>
              import('./features/checkout/success/success').then((c) => c.Success),
          },
          {
            path: 'checkout/cancel',
            loadComponent: () =>
              import('./features/checkout/cancel/cancel').then((c) => c.Cancel),
          },
        ],
      },

      { path: '**', component: NotFound },
    ],
  },
];
