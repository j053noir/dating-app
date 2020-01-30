import { User } from './user';

export interface Message {
    id: number;
    sender: User;
    recipient: User;
    content: string;
    isRead: boolean;
    dateRead: Date;
    dateSent: Date;
}
