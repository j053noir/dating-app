import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
    messages: Message[];
    pagination: Pagination;
    messageContainer = 'Unread';

    routeSubscription: Subscription;
    messagesSubscription: Subscription;
    deleteSubscription: Subscription;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private route: ActivatedRoute,
        private alertify: AlertifyService
    ) {}

    ngOnInit() {
        this.routeSubscription = this.route.data.subscribe(data => {
            this.messages = data.messages.result;
            this.pagination = data.messages.pagination;
        });
    }

    ngOnDestroy() {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
        if (this.messagesSubscription) {
            this.messagesSubscription.unsubscribe();
        }
        if (this.messagesSubscription) {
            this.messagesSubscription.unsubscribe();
        }
    }

    loadMessages() {
        const userId = this.authService.decodedToken.nameid;
        this.messagesSubscription = this.userService
            .getMessages(
                userId,
                this.pagination.currentPage,
                this.pagination.itemsPerPage,
                this.messageContainer
            )
            .subscribe(
                res => {
                    this.messages = res.result;
                    this.pagination = res.pagination;
                },
                err => {
                    this.alertify.error(err);
                }
            );
    }

    deleteMessage(id: number) {
        this.alertify.confirm(
            'Are you sure you want to delete this message',
            () => {
                const userId = this.authService.decodedToken.nameid;
                this.deleteSubscription = this.userService
                    .deleteMessage(userId, id)
                    .subscribe(
                        res => {
                            this.messages.splice(
                                this.messages.findIndex(m => m.id === id)
                            );
                            this.alertify.message('Message deleted');
                        },
                        err => {
                            this.alertify.error(err);
                        }
                    );
            }
        );
    }

    pageChanged(event: any) {
        this.pagination.currentPage = event.page;
        this.loadMessages();
    }
}
