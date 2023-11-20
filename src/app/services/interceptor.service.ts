import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { JWTService } from './jwt.service';
import { Observable, throwError } from 'rxjs';
import {  catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  private apiUrl = environment.apiUrl;
  private token: string = null;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.tokenSubject.subscribe((token) => {
      this.token = token;
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.skipRequest(request.url)) {
      return next.handle(request);
    } else if (this.token) {
      return next.handle(this.updateHeader(request)).pipe(
        catchError((error) => {
          if (error.status === 401) {
            this.router.navigate(['home']);
          }
          return throwError(error);
        })
      );
    } else {
      this.router.navigate(['home']);
    }
  }

  private skipRequest(url: string) {
    const endsWith = ['/logout', '/token-refresh', '/register', '/send-password-reset-link'];
    let skip = false;
    endsWith.forEach((request) => {
      if (url.endsWith(request)) {
        skip = true;
      }
    });
    if (!url.startsWith(this.apiUrl)) {
      skip = true;
    }
    console.log(skip)
    return skip;
  }

  updateHeader(request) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return request;
  }
}
