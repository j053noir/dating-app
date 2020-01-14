import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
    userId: number;
    user: User;
    routeSubscription: Subscription;
    userSubscription: Subscription;

    constructor(private route: ActivatedRoute) {
        this.routeSubscription = this.route.data.subscribe(data => {
            this.user = data.user;
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }
}
