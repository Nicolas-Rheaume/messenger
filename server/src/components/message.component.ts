import { Socket } from 'socket.io'
import { Room } from './room.component'
import { User } from './user.component';

export class Message {
    public static messages: Array<Message> = new Array<Message>();

    constructor(
        public timestamp: Date,
        public text: string,
        public user: User,
        public room: Room,
    ) {
        this.timestamp = timestamp;
        this.text = text;
        this.user = user;
        this.room = room;
    }

    public static async create(socket: Socket, text: string): Promise<Message> {
		return new Promise(async (resolve, reject) => {
			try {
                const user: User = await User.findBySocket(socket).catch(err => { throw err; });
                const room: Room = user.room;
                const newMessage: Message = new Message(new Date(), text, user, room)
                this.messages.push(newMessage);
				resolve(newMessage);
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async findAllMessagesInRoom(room: Room): Promise<Array<Message>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(this.messages.filter(message => {
                    return message.room.id === room.id;
                }));
			} catch (err) {
				reject(err);
			}
		});
	}


}