import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpRequest, HttpHandler,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

    constructor(private toastr: ToastrService) {

    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        return next.handle(request).pipe(
            map(res => {
                console.log("Passed through the interceptor in response");
                return res
             }),
            catchError((error: HttpErrorResponse) => {
                return throwError(error);
            })
        );
    }

       
}