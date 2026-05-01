import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/*
When anyone send req they shouldn't have to manually attach the JWT token to every single API request.
An HTTP Interceptor acts like a toll booth: it catches every outgoing request, attaches the Authorization: Bearer <token> header 
if the user is logged in, and then sends it on its way.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  return next(
    token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req,
  );
};
