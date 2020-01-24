import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../_models/user';
import { Pagination } from 'src/app/_models/pagination';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit, OnDestroy {
    users: User[];
    user: User;
    pagination: Pagination;
    genderList = [
        { value: 'male', key: 'Males' },
        { value: 'female', key: 'Females' },
    ];
    sortingList = [
        { value: 'created', key: 'Creation', direction: 0 },
        { value: 'known_as', key: 'Known As', direction: 0 },
        { value: 'username', key: 'Username', direction: 0 },
        { value: 'last_active', key: 'Activity', direction: 0 },
    ];
    userParams: any = {};
    routeSubscription: Subscription;
    userSubscription: Subscription;
    usersSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService
    ) {}

    ngOnInit() {
        this.routeSubscription = this.route.data.subscribe(data => {
            this.users = data.users.result;
            this.pagination = data.users.pagination;
        });
        this.userSubscription = this.authService.user().subscribe(user => {
            this.user = user;
            this.userParams.applyFilters = false;
            this.userParams.gender =
                this.user.gender === 'male' ? 'female' : 'male';
            this.userParams.minAge = Math.floor(this.user.age / 2 + 7);
            this.userParams.maxAge = Math.ceil((this.user.age - 7) * 2);
            this.userParams.orderBy = 'last_active';
            this.userParams.orderDirection = 'descending';
        });
    }

    ngOnDestroy(): void {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.usersSubscription) {
            this.usersSubscription.unsubscribe();
        }
    }

    loadUsers() {
        this.usersSubscription = this.userService
            .getUsers(
                this.pagination.currentPage,
                this.pagination.itemsPerPage,
                this.userParams
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
        if (this.userParams.applyFilters) {
            this.applyFilters();
        } else {
            this.loadUsers();
        }
    }

    applyFilters() {
        this.userParams.applyFilters = true;
        this.loadUsers();
    }

    resetFilters() {
        this.userParams.applyFilters = false;
        this.userParams.gender =
            this.user.gender === 'male' ? 'female' : 'male';
        this.userParams.minAge = Math.floor(this.user.age / 2 + 7);
        this.userParams.maxAge = Math.ceil((this.user.age - 7) * 2);
        this.userParams.orderBy = 'last_active';
        this.userParams.orderDirection = 'descending';
        this.loadUsers();
    }

    sortUsers(index: number) {
        const sortingEl = this.sortingList[index];

        this.sortingList.map(s => {
            if (s.value !== sortingEl.value) {
                s.direction = 0;
            }
        });

        this.userParams.orderBy = sortingEl.value;
        this.sortingList[index].direction = sortingEl.direction >= 0 ? -1 : 1;
        this.userParams.orderDirection =
            sortingEl.direction >= 0 ? 'ascending' : 'descending';

        this.loadUsers();
    }
}
