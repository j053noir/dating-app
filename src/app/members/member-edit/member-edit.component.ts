import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { Subscription } from 'rxjs';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.scss'],
})
export class MemberEditComponent implements OnInit {
    @ViewChild('editForm', { static: false }) editForm: NgForm;
    user: User;
    routeSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private alertify: AlertifyService
    ) {}

    ngOnInit() {
        this.routeSubscription = this.route.data.subscribe(data => {
            this.user = data.user;
        });
    }

    onSubmit() {
        console.log(this.user);
        this.alertify.success('Profile updated successfully');
        this.editForm.reset(this.user);
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (this.editForm.dirty) {
            $event.returnValue = true;
        }
    }
}
