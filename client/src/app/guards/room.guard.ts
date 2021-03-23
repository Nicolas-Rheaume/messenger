import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Room } from '../models/room.model';
import { ChatService } from '../services/chat.service';
import { SocketService } from '../services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class RoomGuard implements CanActivate {
  private sub: Subscription;

  constructor(
    private chat: ChatService,
    private router: Router,
    private route: ActivatedRoute,
    private socket: SocketService,
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,

  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>(observer => {
      this.sub = this.socket.response('valid-room').subscribe(({isValid}) => {
        if(isValid == true) {
          this.sub.unsubscribe();
          this.chat.room = new Room(next.params['id']);
          observer.next(true)
        }
        else {
          this.sub.unsubscribe();
          this.router.navigate([`/`]);
          observer.next(false)
        }
      })
      this.chat.validateRoom(next.params['id']);
    })
  }
  
}
