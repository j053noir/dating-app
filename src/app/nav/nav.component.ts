import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
    loggedIn = false;
    model: any = {};

    constructor(private authService: AuthService) {}

    ngOnInit() {
        if (localStorage.getItem('token')) {
            this.loggedIn = true;
        }
    }

    login() {
        this.loggedIn = false;
        this.authService.login(this.model).subscribe(
            () => {
                console.log('logged in successfully');
                this.loggedIn = true;
            },
            () => {
                console.log('error logging in');
                this.loggedIn = false;
            }
        );
    }

    logout() {
        this.authService.logout();
        this.loggedIn = false;
    }
}
