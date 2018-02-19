import {Component} from "@angular/core";
import {IonicPage, LoadingController, NavController, NavParams} from "ionic-angular";
import {Chat} from "../../models/chat";
import {ChatPage} from "../chat/chat";
import {ChatService} from "../../services/chat.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
import {ChatNewRecipientPage} from "../chat-new-recipient/chat-new-recipient";
import {LoaderService} from "../../services/loader.service";
import {SocketService} from "../../services/socket.service";

/**
 * Generated class for the ChatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
  providers: [ChatService, AuthService, LoaderService]
})

export class ChatListPage {
  chats: Chat[];
  isLoaded: boolean;
  messageListener;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chatService: ChatService,
              public authService: AuthService,
              public loadService: LoaderService,
              public loadingCtrl: LoadingController,
              public socketService: SocketService) {
  }

  ngOnInit() {
    this.chats = [];
    this.startListening();
  }

  loadChatsFromStorage() {
    if (localStorage.getItem("chats")) {
      this.chats = JSON.parse(localStorage.getItem("chats"));
      this.isLoaded = true;
    }
  }

  destroyListeners() {
    this.messageListener.unsubscribe();
  }

  ionViewDidLeave() {
    this.destroyListeners();
  }

  startListening() {
    this.messageListener = this.socketService.getMessages().subscribe(data => {
      let messageData = data['data'];
      let chatId = messageData['chatId'];
      let updatedChat = this.chats.filter(chat => {
        return chat.id == chatId;
      })[0];
      if(typeof updatedChat !== 'undefined') {
        updatedChat.timeLastMassage = messageData['createdAt'];
        updatedChat.lastMessage = messageData['messageType'] == 'post' ? 'Запись на стене...' : messageData['text'];
        updatedChat.unreadMessages += 1;
      }
    });
  }

  getChats() {
    this.loadChatsFromStorage();
    this.chatService.getChats().subscribe(
      response => {
        this.chats = response.json()
          .conversation.map(conversation => {
            let chat = new Chat();
            chat.id = conversation.chat_id;
            if (conversation.last_message != null) {
              chat.lastMessage = conversation.last_message.message;
              chat.timeLastMassage = conversation.last_message.format_time;
            }
            chat.updatedAt = conversation.updated_at;
            chat.unreadMessages = conversation.unread_message;
            chat.members = conversation.members.map(member => {
              let user = new User();
              user.nickname = member.user.nick_name;
              user.avatar = member.user.avatar;
              return user;
            });
            chat.avatar = conversation.members.filter(member => {
              return member.user.id_user != this.authService.getUserId();
            })[0].user.avatar;
            chat.title = conversation.members.filter(member => {
              return member.user.id_user != this.authService.getUserId();
            })[0].user.nick_name;

            return chat;
          });
        this.isLoaded = true;
        localStorage.setItem("chats", JSON.stringify(this.chats));
      },
      error => {
        this.loadService.hideLoader();
      }
    );
  }

  createChat(targetUserId) {
    this.chatService.createChat(targetUserId).subscribe(
      response => {

      },
      error => {
      }
    );
  }

  onChatPage(chatId, chatAvatar, chatTitle) {
    this.navCtrl.push(ChatPage, {chatId: chatId, chatAvatar: chatAvatar, chatTitle: chatTitle});
  }

  onNewChatPage() {
    this.navCtrl.push(ChatNewRecipientPage);
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.getChats();
  }

}
