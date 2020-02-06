import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.scss'],
})
export class MemberMessagesComponent implements OnInit, OnDestroy {
    @Input() recipientId: number;

    messages: Message[] = [];
    newMessage: any = {};

    messagesSusbcription: Subscription;
    newMessageSusbcription: Subscription;

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
        if (this.newMessageSusbcription) {
            this.newMessageSusbcription.unsubscribe();
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

    sendMessage() {
        const userId = this.authService.decodedToken.nameid;
        this.newMessageSusbcription = this.userService
            .sendMessage(userId, {
                recipientId: this.recipientId,
                content: this.newMessage.content,
            })
            .subscribe(
                (message: Message) => {
                    this.messages.unshift(message);
                    this.newMessage.content = '';
                },
                err => {
                    this.alertify.error(err);
                }
            );
    }
}
