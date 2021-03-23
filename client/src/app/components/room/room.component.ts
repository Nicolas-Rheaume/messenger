import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  constructor(
    public chat: ChatService,
  ) { }

  ngOnInit(): void {
    this.chat.joinRoom();
  }

  ngOnDestroy(): void {
    this.chat.exitRoom();
  }

  

  sendMessage() {
    this.chat.sendMessage();
  }

  exitRoom() {
    this.chat.exitRoom();
  }

}
