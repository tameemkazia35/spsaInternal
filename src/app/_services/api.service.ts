import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { retry, catchError, delay, takeUntil, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token = new BehaviorSubject('');
  //headers: Headers;
  base_path = environment.api;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization' : ''
    })
  }

  global: any = [];

  constructor(private http: HttpClient) { }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.log('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if(error.status == 401){
        //alert();
        //redirect
      }
      console.log(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  };


  // Material Icons
  getIcons(){
      return this.http
        .get<any>('./assets/icons.json')
        .pipe(
          retry(2),
          catchError(this.handleError)
        )
  }


    //General Post
    post(_endpoint: any, _payload: any ){
      return this.http.post<any>(this.base_path + _endpoint, _payload)
      .pipe(
        catchError(this.handleError)
      )
    }
  
    //General Get
    get(_endpoint: any, _term: any){
      let apiURI = this.base_path + _endpoint + _term;
      if( apiURI.lastIndexOf('?') !== -1 ){
        apiURI += '&dt='+ (new Date()).valueOf(); 
      }else {
        apiURI += '?dt='+ (new Date()).valueOf(); 
      }
  
      return this.http.get<any>(apiURI)
        .pipe(
          catchError(this.handleError)
        )  
    }
    
    //General Put
    put(_endpoint: any, _payload: any, _extra: any){
      return this.http.put<any>(this.base_path + _endpoint + _extra, _payload)
        .pipe(
          catchError(this.handleError)
        )
    }
    //General Delete
    delete(_endpoint: any, _term: any, _extra: any){
      return this.http.delete<any>(this.base_path + _endpoint + _term, _extra)
      .pipe(
        catchError(this.handleError)
      )
    }
    //General Patch
    patch(_endpoint: any, _id: any, _payload: any ){
      return this.http.patch<any>(this.base_path + _endpoint + _id, _payload)
      .pipe(
        catchError(this.handleError)
      )
    }

}
