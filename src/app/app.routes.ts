import { Routes } from '@angular/router';
import { Layout } from './shared/components/layout/layout';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { NotFound } from './shared/components/not-found/not-found';
export const routes: Routes = [

    { path: 'login', component: Login },
    { path: 'register', component: Register },
    {
        path: '',
        component: Layout,
        children: [
            // Members 2, 3, and 4 will uncomment these later:

            { path: 'courses', loadComponent: () => import('./features/courses/courses.component').then(c => c.CoursesComponent) },
            {
                path: 'courses/:id',
                loadComponent: () =>
                    import('./features/course-detail/course-detail.component').then(
                        c => c.CourseDetailComponent
                    ),
            },
            /*
            { path: 'cart', canActivate: [authGuard], loadComponent: () => import('./features/cart/cart.component').then(c => c.CartComponent) },
            { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./features/checkout/checkout.component').then(c => c.CheckoutComponent) },
            { path: 'my-courses', canActivate: [authGuard], loadComponent: () => import('./features/my-courses/my-courses.component').then(c => c.MyCoursesComponent) },
            */
            { path: '**', component: NotFound },
        ]
    },

];
