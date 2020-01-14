import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../_models/user';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit, OnDestroy {
    users: User[];
    routeSubscription: Subscription;

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.routeSubscription = this.route.data.subscribe(data => {
            this.users = data.users;
        });
    }

    ngOnDestroy(): void {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }
}
