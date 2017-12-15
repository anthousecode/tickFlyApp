import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Socket} from 'ng-socket-io';

@Injectable()
export class SocketService {
  // socket:SocketIOClient.Socket;

  constructor(private socket: Socket) {
    // this.socket.connect();
    // console.log("Socket service connected")
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  // getInstance() {
  //   if (this.socket == null) {
  //     return SocketIOClient.Socket();
  //   } else {
  //     return this.socket;
  //   }
  // }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  emitChatMessage(message: string, chatId: number, senderId: number, targetUserId: number) {
    this.socket.emit('add-message', {
      text: message,
      chatId: chatId,
      senderId: senderId,
      targetUserId: targetUserId
    });
  }
}
