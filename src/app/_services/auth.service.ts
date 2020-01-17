import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    baseUrl = `${environment.apiUrl}/auth`;
    jwtHelper = new JwtHelperService();
    decodedToken: any;
    currentUser: User;

    constructor(private http: HttpClient, private router: Router) {
        const token = localStorage.getItem(environment.tokenName);
        if (token && this.loggedIn) {
            this.decodedToken = this.jwtHelper.decodeToken(token);

            const user = localStorage.getItem(environment.userObjName);

            if (user) {
                this.currentUser = JSON.parse(user) as User;
            }
        }
    }

    login(model: any) {
        return this.http.post(`${this.baseUrl}/login`, model).pipe(
            map((response: any) => {
                if (response) {
                    localStorage.setItem(environment.tokenName, response.token);
                    localStorage.setItem(
                        environment.userObjName,
                        JSON.stringify(response.user)
                    );
                    this.decodedToken = this.jwtHelper.decodeToken(
                        response.token
                    );
                    this.currentUser = response.user;
                    console.log(this.decodedToken);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem(environment.tokenName);
        localStorage.removeItem(environment.userObjName);
        this.decodedToken = null;
        this.currentUser = null;
        this.router.navigate(['/']);
    }

    register(model: any) {
        return this.http.post(`${this.baseUrl}/register`, model);
    }

    loggedIn() {
        const token = localStorage.getItem(environment.tokenName);
        return !this.jwtHelper.isTokenExpired(token);
    }
}
