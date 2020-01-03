import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    baseUrl = `${environment.apiUrl}/auth`;
    jwtHelper = new JwtHelperService();

    constructor(private http: HttpClient) {}

    login(model: any) {
        return this.http.post(`${this.baseUrl}/login`, model).pipe(
            map((response: any) => {
                if (response) {
                    localStorage.setItem('token', response);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('token');
    }

    register(model: any) {
        return this.http.post(`${this.baseUrl}/register`, model);
    }

    loggedIn() {
        const token = localStorage.getItem('token');
        return !this.jwtHelper.isTokenExpired(token);
    }
}
