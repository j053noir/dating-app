import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../_models/user';
import { Pagination } from 'src/app/_models/pagination';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit, OnDestroy {
    users: User[];
    pagination: Pagination;
    routeSubscription: Subscription;
    usersSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private alertify: AlertifyService
    ) {}

    ngOnInit() {
        this.routeSubscription = this.route.data.subscribe(data => {
            this.users = data.users.result;
            this.pagination = data.users.pagination;
        });
    }

    ngOnDestroy(): void {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
        if (this.usersSubscription) {
            this.usersSubscription.unsubscribe();
        }
    }

    pageChanged(event: any) {
        this.pagination.currentPage = event.page;
        this.loadUsers();
    }

    loadUsers() {
        this.usersSubscription = this.userService
            .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage)
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
}
