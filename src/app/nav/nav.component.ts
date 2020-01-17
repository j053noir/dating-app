import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
    loggedIn = false;
    model: any = {};
    user: User;

    constructor(
        private authService: AuthService,
        private alertifyService: AlertifyService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loggedIn = this.authService.loggedIn();
        if (this.loggedIn) {
            this.user = this.authService.currentUser;
        }
    }

    login() {
        this.loggedIn = false;
        this.authService.login(this.model).subscribe(
            () => {
                this.alertifyService.success('logged in successfully');
                this.user = this.authService.currentUser;
                this.loggedIn = true;
            },
            err => {
                this.alertifyService.error(err);
                this.user = this.authService.currentUser;
                this.loggedIn = false;
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
