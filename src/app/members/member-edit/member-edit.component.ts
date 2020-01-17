import {
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.scss'],
})
export class MemberEditComponent implements OnInit, OnDestroy {
    @ViewChild('editForm', { static: false }) editForm: NgForm;
    user: User;
    routeSubscription: Subscription;
    userSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService
    ) {}

    ngOnInit() {
        this.routeSubscription = this.route.data.subscribe(data => {
            this.user = data.user;
        });
        this.userSubscription = this.authService.user().subscribe(
            user => {
                this.user.photoUrl = user.photoUrl;
            },
            err => {
                this.alertify.error(err);
            }
        );
    }

    ngOnDestroy() {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    onSubmit() {
        this.userService
            .updateUser(this.authService.decodedToken.nameid, this.user)
            .subscribe(
                () => {
                    this.alertify.success('Profile updated successfully');
                    this.editForm.reset(this.user);
                },
                err => {
                    this.alertify.error(err);
                }
            );
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.editForm.dirty) {
            $event.returnValue = true;
        }
    }

    updateMainPhoto(photoUrl: string) {
        this.user.photoUrl = photoUrl;
    }
}
