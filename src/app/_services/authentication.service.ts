import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    API_URL: any;
    constructor(private router: Router, private httpClient: HttpClient) {
      this.API_URL = environment.api;
    }

    login(_userData: any) {

        return this.httpClient.post<any>(this.API_URL + 'app/login', _userData)
            .pipe(map(user => {
                // login successful if there's a jwt token in the response

                if (user && user.token) {
                    user.email = _userData.email;
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}