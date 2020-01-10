import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
    loggedIn = false;
    model: any = {};
    username = 'User';

    constructor(
        private authService: AuthService,
        private alertifyService: AlertifyService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loggedIn = this.authService.loggedIn();
        if (this.loggedIn) {
            this.username = this.authService.decodedToken.unique_name;
        }
    }

    login() {
        this.loggedIn = false;
        this.authService.login(this.model).subscribe(
            () => {
                this.alertifyService.success('logged in successfully');
                this.username = this.authService.decodedToken.unique_name;
                this.loggedIn = true;
            },
            err => {
                this.alertifyService.error(err);
                this.username = this.authService.decodedToken.unique_name;
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
        this.username = 'User';
        this.loggedIn = false;
        this.router.navigate(['/']);
    }
}
