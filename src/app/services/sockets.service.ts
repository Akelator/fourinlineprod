import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as Rx from 'rxjs/Rx';
@Injectable()
export class SocketsService {

  constructor(
    // private conn: WebSocket,
    private socket: Socket,
  ) { 
    // this.conn = new WebSocket('ws://localhost:8080');
    // this.conn.onopen = function(e) {
    //   console.log("connection strablished");
    // }
    // this.conn.onmessage = function(e) {
    //   console.log(e.data);
    // }
    this.socket.connect();
    this.socket.on('messages', data => {
      console.log(data);
    });
  }

}
