import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.scss'],
})
export class MemberCardComponent implements OnInit, OnDestroy {
    @Input() user: User;
    likeSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService
    ) {}

    ngOnInit() {}

    ngOnDestroy() {
        if (this.likeSubscription) {
            this.likeSubscription.unsubscribe();
        }
    }

    sendLike(likeeId: number) {
        const userId = this.authService.decodedToken.nameid;
        this.likeSubscription = this.userService
            .sendLike(userId, likeeId)
            .subscribe(
                res => {
                    this.alertify.success(
                        `You have liked: ${this.user.knownAs}`
                    );
                },
                err => {
                    this.alertify.error(err);
                }
            );
    }
}
