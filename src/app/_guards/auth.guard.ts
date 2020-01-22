import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private alertify: AlertifyService
    ) {}

    canActivate(): boolean {
        if (this.authService.verifyToken()) {
            return true;
        }

        this.alertify.message('Please login to access the application.');
        this.router.navigate(['/']);

        return false;
    }
}
