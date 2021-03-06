import {Injectable} from "@angular/core";
import {AlertController, ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {AuthService} from "./auth.service";

@Injectable()
export class ChatService {
  constructor(private http: Http,
              private authService: AuthService) {
  }


  getChats() {
    return this.http.get(
      this.authService.API + `/api/v1/chat/conversation`,
      this.authService.getHeaders("auth"))
  }

  getChat(chatId, pageNumber) {
    return this.http.get(
      this.authService.API + `/api/v1/chat/load-more?chat_id=${chatId}&page=${pageNumber}`,
      this.authService.getHeaders("auth"))
  }

  createChat(targetUserId) {
    return this.http.post(
      this.authService.API + `/api/v1/chat/start-chat`,
      {receiver_id: targetUserId},
      this.authService.getHeaders("auth"))
  }

  sendMessage(chatId, message) {
    return this.http.post(
      this.authService.API + `/api/v1/chat/send-message`,
      {chat_id: chatId, message: message, message_type: "text"},
      this.authService.getHeaders("auth"))
  }

  getFollowers() {
    const userId = this.authService.getUserId();
    return this.http.get(
      this.authService.API + `/api/v1/user/followers?id_user=` + userId,
      this.authService.getHeaders("auth"))
  }

}
