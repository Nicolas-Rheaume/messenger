import path from 'path';
import fs from 'fs';
import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import { createServer } from "http";
//import { createServer } from "https";
import { Server, Socket } from "socket.io";

import { SocketService } from './components/socket.service';
import { Room } from './components/room.component';
import { User } from './components/user.component';
import { Message } from './components/message.component';

/*
const credentials = {
    key: fs.readFileSync('/etc/letsencrypt/live/nickrheaume.ca/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/nickrheaume.ca/fullchain.pem'),
    dhparam: fs.readFileSync('/etc/letsencrypt/ssl-dhparams.pem'),
}
*/

const app: express.Application = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../../client/dist/client')));
//const server = createServer(credentials, app);
const server = createServer(app);
const options = {
    cors: {
        origin: "*",
    }
}
const io = new Server(server, options );

const port = process.env.PORT || 8081;

let sockets: Socket[] = [];
Room.createHomeRoom();

io.on('connection', async (socket: Socket) => {

    // USER CONNECTS
    sockets.push(socket)
    User.create(socket);
    await SocketService.sendMessage(socket, 'Welcome to Chat App').catch(err => { throw err; });
    console.log(`Connected user with ID: ${socket.id}\t Total: ${sockets.length} users`)

    // USER DISCONNECTS
    socket.on('disconnect', () => {
        sockets = sockets.filter(s => {
            return s.id !== socket.id;
        })
        console.log(`Disconnected user with ID: ${socket.id}\t Total: ${sockets.length} users`)
    })

    // USER RENAME
    socket.on('rename-user', async (name: string) => {
        try {
            await User.validateName(name).catch(err => { throw err; });
            const user: User = await User.findBySocket(socket).catch(err => { throw err; });
            await user.setName(name)
            if(user.room.id != '') {
                User.updateNameToUsersInRoom(socket).catch(err => { throw err; });
            }
        } catch (err) {
            await SocketService.sendMessage(socket, `Error renaming the user, ${err}`).catch(err => { throw err; });
		}
    })

    // CREATE ROOM
    socket.on('create-room', async () => {
        try {
            const newRoom: Room = await Room.create().catch(err => { throw err; });
            socket.join(newRoom.id);
            const user: User = await User.findBySocket(socket).catch(err => { throw err; });
            await user.setRoom(newRoom).catch(err => { throw err; });
            await SocketService.connectRoom(socket, newRoom, []).catch(err => { throw err; });
        } catch (err) {
            await SocketService.sendMessage(socket, `Error creating to the room, ${err}`).catch(err => { throw err; });
		}
    })

    // CREATE ROOM
    socket.on('exit-room', async () => {
        try {
            const user: User = await User.findBySocket(socket).catch(err => { throw err; });
            const room: Room = user.room;
            const home = await Room.findByID('').catch(err => {
                throw err;
            });
            user.setRoom(home).catch(err => { throw err; });
            await SocketService.connectRoom(socket, home, []).catch(err => { throw err; });
            
            const usersInRoom: Array<User> = await User.findAllUsersInRoom(room).catch(err => { throw err; });
            usersInRoom.forEach( async (userInRoom) => {
                const otherUsers: Array<User> = await User.findAllOtherUsersInRoom(userInRoom).catch(err => { throw err; });
                await SocketService.sendAllUser(userInRoom.socket, otherUsers).catch(err => { throw err; });
            })

            if(usersInRoom.length === 0) {
                Room.delete(room).catch(err => { throw err; });
            }
        } catch (err) {
            await SocketService.sendMessage(socket, `Error exiting to the room, ${err}`).catch(err => { throw err; });
		}
    })

    // VALIDATE ROOM
    socket.on('validate-room', async (id: string) => {
        try {
            const room: Room = await Room.findByID(id).catch(err => { throw err; });
            await SocketService.sendValidRoom(socket, true).catch(err => { throw err; });
        } catch (err) {
            await SocketService.sendValidRoom(socket, false).catch(err => { throw err; });
		}
    })

    // JOIN ROOM
    socket.on('join-room', async (id: string) => {
        try {
            const room: Room = await Room.findByID(id).catch(err => { throw err; });
            const user: User = await User.findBySocket(socket).catch(err => { throw err; });
            user.setRoom(room).catch(err => { throw err; });
            const otherUsersInRoom: Array<User> = await User.findAllOtherUsersInRoom(user).catch(err => { throw err; });
            const messagesInRoom: Array<Message> = await Message.findAllMessagesInRoom(room).catch(err => { throw err; });
            await SocketService.sendAllData(user.socket, room, otherUsersInRoom, messagesInRoom).catch(err => { throw err; });
            otherUsersInRoom.forEach( async (userInRoom) => {
                await SocketService.sendNewUser(userInRoom.socket, user).catch(err => { throw err; });
            })

        } catch (err) {
            await SocketService.sendMessage(socket, `Error joining the room, ${err}`).catch(err => { throw err; });
		}
    })

    // SEND MESSAGE
    socket.on('send-message', async (message: string) => {
        try {
            const newMessage: Message = await Message.create(socket, message).catch(err => { throw err; });
            const user: User = await User.findBySocket(socket).catch(err => { throw err; });
            const usersInRoom: Array<User> = await User.findAllUsersInRoom(user.room).catch(err => { throw err; });
            usersInRoom.forEach( async (userInRoom) => {
                await SocketService.sendNewMessage(userInRoom.socket, newMessage).catch(err => { throw err; });
            })
        } catch (err) {
            await SocketService.sendMessage(socket, `Error sending a message to the room, ${err}`).catch(err => { throw err; });
		}
    })
})

/*
server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
*/

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
})