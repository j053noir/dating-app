import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

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

    constructor(
        private userService: UserService,
        private alertify: AlertifyService,
        private route: ActivatedRoute
    ) {
        this.routeSubscription = this.route.params.subscribe((params: any) => {
            this.userId = +params.id;
            if (this.userId) {
                this.loadUser(this.userId);
            } else {
                this.alertify.error(`Id: ${this.userId} is not a valid`);
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    loadUser(id: number) {
        this.userSubscription = this.userService.getUser(id).subscribe(
            (user: User) => {
                this.user = user;
            },
            err => {
                this.alertify.error(err);
            }
        );
    }
}
