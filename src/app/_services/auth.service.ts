import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    baseUrl = `${environment.apiUrl}/auth`;
    jwtHelper = new JwtHelperService();
    decodedToken: any;

    constructor(private http: HttpClient) {
        const token = localStorage.getItem(environment.tokenName);
        if (token && this.loggedIn) {
            this.decodedToken = this.jwtHelper.decodeToken(token);
        }
    }

    login(model: any) {
        return this.http.post(`${this.baseUrl}/login`, model).pipe(
            map((response: any) => {
                if (response) {
                    localStorage.setItem(environment.tokenName, response.token);
                    this.decodedToken = this.jwtHelper.decodeToken(
                        response.token
                    );
                    console.log(this.decodedToken);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem(environment.tokenName);
    }

    register(model: any) {
        return this.http.post(`${this.baseUrl}/register`, model);
    }

    loggedIn() {
        const token = localStorage.getItem(environment.tokenName);
        return !this.jwtHelper.isTokenExpired(token);
    }
}
