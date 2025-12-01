import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const excludedUrls = ['/auth/login','/users/register'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (isExcluded) {
    return next(req);
  }

  if (req.context.get(IS_PUBLIC)) {
    return next(req);
  }

  if (authService.isAuthenticated()) {
    const authRequest = addAuthorizationHeader(req, authService);
    return next(authRequest)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};

const addAuthorizationHeader = (req: HttpRequest<any>, authService: AuthService) => {
  const token = authService.getToken();

  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
};

export const IS_PUBLIC = new HttpContextToken(() => false);
