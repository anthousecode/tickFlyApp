import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {User} from "../../models/user";
import {ChatService} from "../../services/chat.service";
import {ChatPage} from "../chat/chat";
import {LoaderService} from "../../services/loader.service";
import {AuthService} from "../../services/auth.service";

/**
 * Generated class for the ChatNewRecipientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-new-recipient',
  templateUrl: 'chat-new-recipient.html',
  providers: [ChatService, LoaderService, AuthService]
})
export class ChatNewRecipientPage {

  chatCandidates: User[];
  userId: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chatService: ChatService,
              public loadService: LoaderService,
              public authService: AuthService) {
  }

  ionViewDidLoad() {
    this.userId = Number(this.authService.getUserId());
    this.getFollowers();
  }

  getFollowers() {
    this.loadService.showLoader();
    this.chatService.getFollowers().subscribe(
      response => {
        this.chatCandidates = response.json().followers.map(follower => {
          let user = new User();
          user.id = follower.user_follower.id_user;
          user.nickname = follower.user_follower.nick_name;
          user.avatar = follower.user_follower.avatar;
          return user;
        });
        this.loadService.hideLoader();
      },
      error => {
        this.loadService.hideLoader();
      }
    );
  }

  createChat(userId) {
    this.chatService.createChat(userId).subscribe(
      response => {
        const chatId = response.json().chat_id;
        let interlocutor = response.json().members.filter(member => {
          return member.user.id_user != this.userId;
        })[0];
        const chatAvatar = interlocutor.user.avatar;
        const chatTitle = interlocutor.user.first_name + interlocutor.user.last_name;
        this.navCtrl.push(ChatPage, {chatId: chatId, chatAvatar: chatAvatar, chatTitle: chatTitle});
      },
      error => {

      }
    )
  }


}
