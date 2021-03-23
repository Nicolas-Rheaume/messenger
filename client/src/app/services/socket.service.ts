import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
//import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    public socket: Socket
  ) {
  }

  // Socket request
	public request(event: string, data: any): void {
		this.socket.emit(event, data);
	}

	// Socket response
	public response(event: string): Observable<any> {
		return Observable.create(observer => {
			this.socket.on(event, data => {
				observer.next(data);
			});
		});
	}
/*
  getMessage() {
    return this.socket.fromEvent<any>('msg').map(data => data.msg);
  }

  sendMessage(msg: string) {
    this.socket.emit('msg', msg);
  }

  /*
  private socket: SocketIOClient.Socket = io('ws://localhost:8081');
  //private socket = io('ws://localhost:8081');

  constructor() { }

  // Socket request
  public request(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  // Socket response
  public response(event: string): Observable<any> {
    return Observable.create(observer => {
      this.socket.on(event, data => {
        observer.next(data);
      });
    });
  }
  */
}
