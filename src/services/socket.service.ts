import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Socket} from 'ng-socket-io';

@Injectable()
export class SocketService {

  constructor(private socket: Socket) {
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  triggerStatusMessage() {
    this.socket.emit('read-message', {
      read: true
    });
    console.log('triggerStatusMessage()');
  }

  getStatusMessage() {
    let observable = new Observable(observer => {
      this.socket.on('message-status', (data) => {
        observer.next(data);
        console.log('getStatusMessage()');
      });
    });
    return observable;
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  emitChatMessage(message: string, chatId: number, senderId: number, targetUserId: number, currentDatetime: string, messageType: string, postId?: number) {
    this.socket.emit('add-message', {
      text: message,
      chatId: chatId,
      senderId: senderId,
      targetUserId: targetUserId,
      createdAt: currentDatetime,
      messageType: messageType,
      id_post: postId
    });
  }
}
