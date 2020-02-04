import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Subscription } from 'rxjs';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.scss'],
})
export class MemberMessagesComponent implements OnInit, OnDestroy {
    @Input() recipientId: number;

    messages: Message[] = [];
    messagesSusbcription: Subscription;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService
    ) {}

    ngOnInit() {
        this.loadMessages();
    }

    ngOnDestroy(): void {
        if (this.messagesSusbcription) {
            this.messagesSusbcription.unsubscribe();
        }
    }

    loadMessages() {
        const userId = this.authService.decodedToken.nameid;
        this.messagesSusbcription = this.userService
            .getMessageThread(userId, this.recipientId)
            .subscribe(
                messages => {
                    this.messages = messages;
                },
                err => {
                    this.alertify.error(err);
                }
            );
    }
}
