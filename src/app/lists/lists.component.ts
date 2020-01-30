import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Pagination } from '../_models/pagination';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit, OnDestroy {
    users: User[];
    pagination: Pagination;
    likesParams = 'likers';

    usersSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private route: ActivatedRoute,
        private alertify: AlertifyService
    ) {}

    ngOnInit() {
        this.usersSubscription = this.route.data.subscribe(data => {
            this.users = data.users.result;
            this.pagination = data.users.pagination;
        });
    }

    ngOnDestroy() {
        if (this.usersSubscription) {
            this.usersSubscription.unsubscribe();
        }
    }

    loadUsers() {
        this.usersSubscription = this.userService
            .getUsers(
                this.pagination.currentPage,
                this.pagination.itemsPerPage,
                null,
                this.likesParams
            )
            .subscribe(
                res => {
                    this.users = res.result;
                    this.pagination = res.pagination;
                },
                err => {
                    this.alertify.error(err);
                }
            );
    }

    pageChanged(event: any) {
        this.pagination.currentPage = event.page;
        this.loadUsers();
    }
}
