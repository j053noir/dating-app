import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { PaginatedResult } from '../_models/pagination';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<PaginatedResult<Message[]>> {
    page = 1;
    itemsPerPage = 5;
    messageContainer = 'Unread';

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService,
        private router: Router
    ) {}

    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<PaginatedResult<Message[]>> {
        const userId = this.authService.decodedToken.nameid;
        return this.userService
            .getMessages(
                userId,
                this.page,
                this.itemsPerPage,
                this.messageContainer
            )
            .pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving messages data.');
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );
    }
}
