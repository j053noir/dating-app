import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import {
    NgxGalleryAnimation,
    NgxGalleryImage,
    NgxGalleryOptions,
} from 'ngx-gallery';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
    @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;

    user: User;
    routeSubscription: Subscription;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    likeSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.routeSubscription = this.route.data.subscribe(data => {
            this.user = data.user;
        });

        this.galleryOptions = [
            {
                width: '500px',
                height: '500px',
                imagePercent: 100,
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                preview: false,
            },
        ];

        this.galleryImages = this.getImages();
    }

    ngOnDestroy() {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
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

    selectTab(tabId: number) {
        this.memberTabs.tabs[tabId].active = true;
    }

    getImages() {
        const imagesUrls = [];
        for (const photo of this.user.photos) {
            imagesUrls.push({
                small: photo.url,
                medium: photo.url,
                big: photo.url,
                description: photo.description,
            });
        }

        return imagesUrls;
    }
}
