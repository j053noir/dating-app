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
    username = 'User';

    constructor(
        private authService: AuthService,
        private alertifyService: AlertifyService
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
            }
        );
    }

    logout() {
        this.authService.logout();
        this.username = 'User';
        this.loggedIn = false;
    }
}
