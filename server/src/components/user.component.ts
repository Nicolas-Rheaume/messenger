import { Socket } from 'socket.io'
import { Room } from './room.component'

export class User {
    public static users: Array<User> = new Array<User>();

    constructor(
        public name: string,
        public room: Room,
        public socket: Socket,
        public connected: boolean
    ) {
        this.name = name;
        this.room = room;
        this.socket = socket;
        this.connected = connected;
    }

    public static async create(socket: Socket): Promise<User> {
		return new Promise(async (resolve, reject) => {
			try {
                const home = await Room.findByID('').catch(err => {
                    throw err;
                });
                const newUser = new User('User', home, socket, true);
                this.users.push(newUser)
				resolve(newUser);
			} catch (err) {
				reject(err);
			}
		});
	}

    public async setConnection(connected: boolean): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                this.connected = connected;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

    public async setName(name: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                this.name = name;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

    public async setRoom(room: Room): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                this.room = room;
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async validateName(name: string): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                if(name.length >= 10 || !/^[0-9a-zA-Z]+$/.test(name)) {
                    throw 'Error invalid name';
                }
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async delete(socket: Socket): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                this.users = this.users.filter(user => {
                    return user.socket.id !== socket.id;
                })
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async findBySocket(socket: Socket): Promise<User> {
		return new Promise(async (resolve, reject) => {
			try {
                let index = this.users.findIndex((user, i) => {
                    if(user.socket.id === socket.id)
                        return true;
                })
                if(index >= 0) {
                    resolve(this.users[index])
                } else {
                    reject(`Error finding to the user, the user id doesn't exists.`)
                }
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async findAllUsersInRoom(room: Room): Promise<Array<User>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(this.users.filter(user => {
                    return user.room.id === room.id;
                }));
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async findAllOtherUsersInRoom(currentUser: User): Promise<Array<User>> {
		return new Promise(async (resolve, reject) => {
			try {
				resolve(this.users.filter(user => {
                    return currentUser.room.id === user.room.id && currentUser.socket.id !== user.socket.id;
                }));
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async updateNameToUsersInRoom(socket: Socket): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                const thisUser: User = await this.findBySocket(socket).catch(err => { throw err; });
                const usersInRoom: Array<User> = this.users.filter(user => {
                    return thisUser.room.id === user.room.id;
                })
                usersInRoom.forEach(currentUser => {
                    currentUser.socket.emit('users-in-room', usersInRoom.filter(user => {
                        return user.socket.id !== currentUser.socket.id
                    }).map((user) => {
                        return user.name
                    }))
                });
                resolve();
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async getOtherUsersName(socket: Socket): Promise<Array<string>> {
		return new Promise(async (resolve, reject) => {
			try {
                const currentUser: User = await this.findBySocket(socket).catch(err => { throw err; });
                const usersInRoom: Array<User> = this.users.filter(user => {
                    return currentUser.room.id === user.room.id && currentUser.socket.id !== user.socket.id;
                })
                resolve(usersInRoom.map(user => {
                    return user.name
                }))
			} catch (err) {
				reject(err);
			}
		});
	}

}