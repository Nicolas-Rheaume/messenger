import { User } from "./user.model";


export class Message {
    timestamp?: Date;
    text?: string;
    user?: User;

    constructor(
        timestamp: Date,
        text: string,
        user: User,
    ) {
        this.timestamp = timestamp;
        this.text = text;
        this.user = user;
    }
}