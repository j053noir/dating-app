import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
    loggedIn = false;
    model: any = {};

    constructor(
        private authService: AuthService,
        private alertifyService: AlertifyService
    ) {}

    ngOnInit() {
        if (localStorage.getItem('token')) {
            this.loggedIn = true;
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
            }
        );
    }

    logout() {
        this.authService.logout();
        this.loggedIn = false;
    }
}
