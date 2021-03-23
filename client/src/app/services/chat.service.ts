import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from './socket.service';

import { Message } from '../models/message.model';
import { Room } from '../models/room.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private sub: Subscription;
  public currentUser: User = new User();
  public currentMessage: String = "";
  public room: Room = new Room('');
  public usersInRoom: Array<User> = new Array<User>();
  public messagesInRoom: Array<Message> = new Array<Message>();


  constructor(
    private socket: SocketService,
    private router: Router
  ) { 

    this.sub = this.socket.response('message').subscribe(({message}) => {
			console.log(message)
		});

    this.sub = this.socket.response('connect-room').subscribe(({id}) => {
      this.router.navigate([`/${id}`]);
		});

    this.sub = this.socket.response('all-data').subscribe(({users, messages}) => {
      this.usersInRoom = new Array<User>();
      users.forEach(user => {
        this.usersInRoom.push(new User(user));
      });
      this.messagesInRoom = new Array<Message>();
      messages.forEach(message => {
        this.messagesInRoom.push(new Message(message.timestamp, message.text, new User()));
      });
		});

    this.sub = this.socket.response('all-users').subscribe(({users}) => {
      this.usersInRoom = new Array<User>();
      users.forEach(user => {
        this.usersInRoom.push(new User(user.name));
      });
		});

    this.sub = this.socket.response('all-messages').subscribe(({messages}) => {
      this.messagesInRoom = new Array<Message>();
      messages.forEach(message => {
        this.messagesInRoom.push(new Message(message.timestamp, message.text, new User()));
      });
		});

    this.sub = this.socket.response('new-user').subscribe(({user}) => {
      this.usersInRoom.push(new User(user));
		});

    this.sub = this.socket.response('new-message').subscribe(({timestamp, text, user}) => {
      this.messagesInRoom.push(new Message(new Date(timestamp), text, new User(user)));
      this.currentMessage = ""
		});



  }

  createRoom() {
    this.socket.request('create-room', '');
  }

  joinRoom() {
    this.socket.request('join-room', this.room.id);
  }

  renameUser() {
    this.socket.request('rename-user', this.currentUser.name);
  }

  validateRoom(id: string) {
    this.socket.request('validate-room', id);
  }

  exitRoom() {
    this.socket.request('exit-room', '');
  }

  getAllData() {
    this.socket.request('get-all-data', '');
  }

  sendMessage() {
    this.socket.request('send-message', this.currentMessage);
  }
}
