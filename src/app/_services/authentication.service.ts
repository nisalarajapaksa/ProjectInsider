import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@app/_models';
import { ENDPOINTS, RESPONSE_CODE } from '../_constants'; // TODO: User @

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string, companycode: string) {
        return this.http.post<any>(ENDPOINTS.login, { 
            "AppAccessSession": {
                "AppAccessUID": username,
                "CompanyCode": companycode,
                "AppAccessPWD": password,
                "ApplicationType": 3
            }
        })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.responseCode == RESPONSE_CODE.loginSuccess) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user['responseObject'][0]));
                    this.currentUserSubject.next(user['responseObject'][0]);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}