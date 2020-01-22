import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
    loggedIn = false;
    model: any = {};
    user: User;
    userSubscription: Subscription;
    loggedInSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private alertifyService: AlertifyService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loggedInSubscription = this.authService
            .status()
            .subscribe(loggedIn => {
                this.loggedIn = loggedIn;
            });
        this.userSubscription = this.authService.user().subscribe(
            user => {
                this.user = user;
            },
            err => {
                this.alertifyService.error(err);
            }
        );
    }

    ngOnDestroy() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.loggedInSubscription) {
            this.loggedInSubscription.unsubscribe();
        }
    }

    login() {
        this.authService.login(this.model).subscribe(
            () => {
                this.alertifyService.success('logged in successfully');
            },
            err => {
                this.alertifyService.error(err);
                this.authService.logout();
            },
            () => {
                if (this.loggedIn) {
                    this.router.navigate(['/members']);
                } else {
                    this.router.navigate(['/']);
                }
            }
        );
    }

    logout() {
        this.authService.logout();
        this.user = null;
        this.router.navigate(['/']);
    }
}
