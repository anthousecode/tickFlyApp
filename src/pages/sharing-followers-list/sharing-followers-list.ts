import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {ShareService} from "../../services/share.service";
import {AuthService} from "../../services/auth.service";
import {ToastService} from "../../services/toast.service";
import {SocketService} from "../../services/socket.service";
import {Chat} from "../../models/chat";
import {ChatService} from "../../services/chat.service";

/**
 * Generated class for the SharingFollowersListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sharing-followers-list',
  templateUrl: 'sharing-followers-list.html',
  providers: [ShareService, AuthService, ToastService, SocketService, ChatService]
})
export class SharingFollowersListPage {
  postId: number;
  selectedItem: any;
  followersList = [];
  userId: number;
  chat: Chat;
  post;
  unreadMessageCount;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public shareService: ShareService,
              public toastService: ToastService,
              public socketService: SocketService,
              public authService: AuthService,
              public chatService: ChatService) {
    this.postId = this.navParams.get('postId');
    this.post = this.navParams.get('post');
    this.chat = new Chat();
    this.chat.messages = [];
  }

  ngOnInit() {
    this.shareService.getFollowers()
      .subscribe(
        response => {
          this.followersList = response.json().subscribers;
        },
        error => {
        }
      )
  }

  ionViewDidLoad() {
    this.userId = Number(this.authService.getUserId());
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  getChat(chatId) {
    const lStorageKey = "chatMessages_" + chatId;
    if (localStorage.getItem(lStorageKey)) {
      this.chat.messages = JSON.parse(localStorage.getItem(lStorageKey));
    } else {
      this.chatService.getChat(chatId).subscribe(
        response => {
          this.chat.messages = response.json().messages.map(message => {
            message.userId = message.user_id;
            message.createdAt = message.format_time;
            message.messageType = message.message_type;
            return message;
          });
          localStorage.setItem(lStorageKey, JSON.stringify(this.chat.messages));

          this.unreadMessageCount = response.json().count_unread_message;
          localStorage.setItem("unreadMessages", this.unreadMessageCount);
        },
        error => {
          // this.loadService.hideLoader();
        }
      );
    }
  }

  itemTapped(event, idUser) {
    console.log('chosen follower postId ' + this.postId);
    console.log('chosen follower idUser ' + idUser);

    let currentdate = new Date();
    let currentDatetime = currentdate.getHours() + ":" + (currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes();


    this.shareService.sharePost(this.postId, idUser)
      .subscribe(
        response => {
          console.log(response.json());
          const chatId = response.json().chat_id;
          const message = response.json().message;
          this.getChat(chatId);
          this.socketService.emitChatMessage(this.post.title, chatId, this.userId, idUser, currentDatetime);
          console.log('chat messages ' + this.chat.messages);

          this.chat.messages.push({
              userId: this.userId,
              message: message,
              createdAt: currentDatetime,
              messageType: 'post'
            }
          );


          console.log('chat message afetr ' + this.chat.messages);
          this.closeModal();
          this.toastService.showToast('Вы успешно поделились постом!');
        },
        error => {
          console.log(error.json());
        }
      )
  }

}
