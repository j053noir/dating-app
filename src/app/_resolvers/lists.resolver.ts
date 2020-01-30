import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';

@Injectable()
export class ListsResolver implements Resolve<User[]> {
    page = 1;
    itemsPerPage = 5;
    likesParams = 'likers';

    constructor(
        private userService: UserService,
        private alertify: AlertifyService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService
            .getUsers(this.page, this.itemsPerPage, null, this.likesParams)
            .pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving data.');
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );
    }
}
