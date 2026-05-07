import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const router = inject(Router);
  const token = authService.getToken();

  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = error.error?.data?.message || error.error?.message || error.message || errorMessage;

        if (error.status === 401) {
          authService.logout();
          if (!req.url.includes('/login')) {
            router.navigate(['/login'], { replaceUrl: true });
            if (errorMessage === error.message || !errorMessage) {
              errorMessage = 'Session expired. Please login again.';
            }
          }
        } else if (error.status === 0) {
          errorMessage = 'Server is unreachable. Please check your connection.';
        }
      }


      const isUnenrolledCourseAccess = error.status === 403 && req.url.includes('/lessons');
      if (!isUnenrolledCourseAccess) {
        toastService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};

