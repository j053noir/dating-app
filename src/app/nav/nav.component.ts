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

    constructor(
        private authService: AuthService,
        private alertifyService: AlertifyService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loggedIn = this.authService.loggedIn();
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
    }

    login() {
        this.loggedIn = false;
        this.authService.login(this.model).subscribe(
            () => {
                this.alertifyService.success('logged in successfully');
                this.loggedIn = true;
            },
            err => {
                this.alertifyService.error(err);
                this.loggedIn = false;
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
        this.loggedIn = false;
        this.router.navigate(['/']);
    }
}
