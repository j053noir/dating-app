import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

export interface LoginModel {
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    baseUrl = `${environment.apiUrl}/auth`;
    jwtHelper = new JwtHelperService();
    decodedToken: any;
    private currentUser = new BehaviorSubject<User>(null);
    private loggedIn = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient, private router: Router) {
        const token = localStorage.getItem(environment.tokenName);
        if (token && this.verifyToken) {
            this.loggedIn.next(true);

            this.decodedToken = this.jwtHelper.decodeToken(token);

            const user = localStorage.getItem(environment.userObjName);

            if (user) {
                this.currentUser.next(JSON.parse(user) as User);
            }
        }
    }

    user(): Observable<User> {
        return this.currentUser.asObservable();
    }

    changeMemberPhoto(photoUrl: string) {
        const currentUser = { ...this.currentUser.value };
        currentUser.photoUrl = photoUrl;
        this.currentUser.next(currentUser);
    }

    login(model: LoginModel) {
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
                    this.currentUser.next(response.user as User);
                    this.loggedIn.next(true);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem(environment.tokenName);
        localStorage.removeItem(environment.userObjName);
        this.decodedToken = null;
        this.currentUser.next(null);
        this.loggedIn.next(false);
        this.router.navigate(['/']);
    }

    register(model: User) {
        return this.http.post<User>(`${this.baseUrl}/register`, model);
    }

    status() {
        return this.loggedIn.asObservable();
    }

    verifyToken() {
        const token = localStorage.getItem(environment.tokenName);
        return token ? !this.jwtHelper.isTokenExpired(token) : false;
    }
}
