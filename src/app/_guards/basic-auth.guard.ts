import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

    constructor() {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with basic auth credentials if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
       
        if (currentUser) {
            var token = currentUser.token;
            request = request.clone({
                setHeaders: { 
                    Authorization: 'Bearer ' + `${token}`,
                    'Content-Type': 'application/json'
                },
                body: request.body
            });
        }
        return next.handle(request);
    }
}