import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { PaginatedResult } from '../_models/pagination';

@Injectable()
export class MemberListResolver implements Resolve<PaginatedResult<User[]>> {
    page = 1;
    itemsPerPage = 5;

    constructor(
        private userService: UserService,
        private alertify: AlertifyService,
        private router: Router
    ) {}

    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<PaginatedResult<User[]>> {
        return this.userService.getUsers(this.page, this.itemsPerPage).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving user data.');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
