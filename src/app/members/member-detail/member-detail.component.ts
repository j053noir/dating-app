import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    NgxGalleryAnimation,
    NgxGalleryImage,
    NgxGalleryOptions,
} from 'ngx-gallery';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/user';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit, OnDestroy {
    user: User;
    routeSubscription: Subscription;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    constructor(private route: ActivatedRoute) {}

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
