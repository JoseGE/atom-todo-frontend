import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { USER_ACCESS_PROVIDER } from '../acces-control/user-access.tokens';

function shouldAddAuthHeader(url: string): boolean {
  const authEndpoints = ['/auth', '/user'];
  return !authEndpoints.some((endpoint) => url.includes(endpoint));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userAccessValidator = inject(USER_ACCESS_PROVIDER);
  const router = inject(Router);
  const token = userAccessValidator.getUserSessionToken();

  if (token && shouldAddAuthHeader(req.url)) {
    const authenticatedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authenticatedRequest).pipe(
      catchError((error) => {
        if (error.status === 401 || error.status === 403) {
          userAccessValidator.clearUserSession();
          router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        userAccessValidator.clearUserSession();
        router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    })
  );
};
