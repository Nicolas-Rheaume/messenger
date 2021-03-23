import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  // Variables
  roomID = "";
  invalidUsername: boolean = false;
  invalidRoom: boolean = false;

  constructor(
    public chat: ChatService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }

  onSubmitUsername() {
    this.chat.renameUser();
  }


  onCreateRoom() {
    if(this.chat.currentUser.name == null || this.chat.currentUser.name == '') {
      this.invalidUsername = true;
    } else {
      this.chat.createRoom();
      this.invalidUsername = false;
    }
  }

  onJoinRoom() {
    if(this.roomID == null || this.roomID == '') {
      if(this.chat.currentUser.name == null || this.chat.currentUser.name == '') {
        this.invalidUsername = true;
      } else {
        this.invalidUsername = false;
      }
      this.invalidRoom = true;
    } else {
      this.router.navigate([`/${this.roomID}`]);
      this.invalidRoom = false;
      this.invalidUsername = false;
    }
  }
  

}
