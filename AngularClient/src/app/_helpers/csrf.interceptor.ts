import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import Cookies from 'js-cookie';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let cookie = Cookies.get('csrftoken')

    if (cookie) {
      request = request.clone({
        setHeaders: {
          'X-CSRFTOKEN': cookie
        }
      });
    }
    return next.handle(request);
  }
}
