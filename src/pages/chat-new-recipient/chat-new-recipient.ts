import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {User} from "../../models/user";
import {ChatService} from "../../services/chat.service";
import {Chat} from "../../models/chat";
import {ChatPage} from "../chat/chat";
import {LoaderService} from "../../services/loader.service";

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
  providers: [ChatService, LoaderService]
})
export class ChatNewRecipientPage {

  chatCandidates: User[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chatService: ChatService,
              public loadService: LoaderService) {
  }

  ionViewDidLoad() {
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
        this.navCtrl.push(ChatPage, {chatId: chatId});
      },
      error => {

      }
    )
  }


}
