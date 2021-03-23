import { CHAT_CONFIG } from '../configs/chat.config'

export class Room {
    public static rooms: Array<Room> = new Array<Room>();

    constructor(
        public id: string
    ) {
        this.id = id;
    }

    public static async createHomeRoom(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                this.rooms.push(new Room(''));
				resolve();
			} catch (err) {
				reject(err);
			}
		});
	} 

    public static async create(): Promise<Room> {
		return new Promise(async (resolve, reject) => {
			try {
                let id = await this.generateRandomRoomID();
                let newRoom: Room = new Room(id);
                this.rooms.push(newRoom);
				resolve(newRoom);
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async delete(current: Room): Promise<void> {
		return new Promise(async (resolve, reject) => {
			try {
                const index = this.rooms.findIndex((room, i) => {
                    if(room.id === current.id) {
                        return true;
                    }
                })
                if(index >= 0) {
                    this.rooms = this.rooms.splice(index, 1);
                    resolve()
                } else {
                    reject(`the room id doesn't exists.`)
                }
			} catch (err) {
				reject(err);
			}
		});
	}

    public static async findByID(id: string): Promise<Room> {
		return new Promise(async (resolve, reject) => {
			try {
                const index = this.rooms.findIndex((room, i) => {
                    if(room.id === id) {
                        return true;
                    }
                })
                if(index >= 0) {
                    resolve(this.rooms[index])
                } else {
                    reject(`the room id doesn't exists.`)
                }
			} catch (err) {
				reject(err);
			}
		});
	}



    private static async generateRandomRoomID(): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
                let check: boolean = true;
                let id: string = '';
                while(check) {
                    check = false;
                    id = '';
                    for(let i = 0; i < CHAT_CONFIG.codeLength; i++) {
                        id += CHAT_CONFIG.characters.charAt(Math.floor(Math.random() * CHAT_CONFIG.characters.length));
                    }
                    for(let i = 0; i < this.rooms.length; i++) {
                        if(this.rooms[i].id === id) {
                            check = true;
                            break;
                        }
                    }
                }
				resolve(id);
			} catch (err) {
				reject(err);
			}
		});
	}
}