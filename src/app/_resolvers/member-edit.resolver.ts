import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        const userId = this.authService.decodedToken.nameid;

        if (!userId) {
            this.alertify.error('Problem with decoded token.');
            this.router.navigate(['/']);
            return of(null);
        }

        return this.userService.getUser(userId).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving user data.');
                this.router.navigate(['/']);
                return of(null);
            })
        );
    }
}
