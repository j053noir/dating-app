import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { UserService } from '../../_services/user.service';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit, OnDestroy {
    users: User[];
    usersSubscription: Subscription;

    constructor(
        private userService: UserService,
        private alerity: AlertifyService
    ) {}

    ngOnInit() {
        this.loadUsers();
    }

    ngOnDestroy(): void {
        if (this.usersSubscription) {
            this.usersSubscription.unsubscribe();
        }
    }

    loadUsers() {
        this.usersSubscription = this.userService.getUsers().subscribe(
            (users: User[]) => {
                this.users = users;
            },
            err => {
                this.alerity.error(err);
            }
        );
    }
}
