import { Socket } from 'socket.io'
import { Room } from './room.component'
import { User } from './user.component'
import { Message } from './message.component'

export class SocketService {

	public static async sendConsole(socket: Socket, message: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                socket.emit('console', {
                    message: message
                })
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async sendMessage(socket: Socket, message: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                socket.emit('message', {
                    message: message
                })
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public static async sendValidRoom(socket: Socket, valid: boolean): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                socket.emit('valid-room', {
                    isValid: valid
                })
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async connectRoom(socket: Socket, room: Room, users: Array<User>): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                socket.emit('connect-room', {
                    id: room.id,
                    users: users.map(user => {
                        return user.name
                    })
                })
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async sendNewMessage(socket: Socket, message: Message): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                socket.emit('new-message', {
                    time: message.timestamp,
                    user: message.user.name,
                    text: message.text
                })
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public static async sendAllData(socket: Socket, room: Room, users: Array<User>, messages: Array<Message>): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                socket.emit('all-data', {
					room: room.id,
					users: users.map(user => {
                        return user.name
                    }),
					messages: messages.map(message => {
						return {
							timestamp: message.timestamp,
							text: message.text,
							user: message.user.name
						}
                    }),
                })
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public static async sendNewUser(socket: Socket, newUser: User): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                socket.emit('new-user', {
                    user: newUser.name,
                })
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

	public static async sendAllUser(socket: Socket, users: Array<User>): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                socket.emit('all-users', {
                    users: users.map(user => {
                        return user.name
                    }),
                })
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}








}