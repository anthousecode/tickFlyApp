import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {Chat} from "../../models/chat";
import {ChatsProvider} from "../../providers/chats/chats";
import {ChatPage} from "../chat/chat";
import {ChatService} from "../../services/chat.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
import {ChatNewRecipientPage} from "../chat-new-recipient/chat-new-recipient";

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
  providers: [ChatService, AuthService]
})

export class ChatListPage {
  chats: Chat[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chatProvider: ChatsProvider,
              public chatService: ChatService,
              public authService: AuthService) {
  }

  ngOnInit() {

  }

  getChats() {
    this.chatService.getChats().subscribe(
      response => {
        // console.log("Conversations", JSON.parse(response.text()).conversation);
        this.chats = response.json()
          .conversation.map(conversation => {
            console.log(conversation);
            let chat = new Chat();
            chat.id = conversation.chat_id;
            chat.updatedAt = conversation.updated_at;
            chat.unreadMessages = conversation.unread_message;
            chat.members = conversation.members.map(member => {
              let user = new User();
              user.nickname = member.user.nick_name;
              user.avatar = member.user.avatar;
              return user;
            });
            return chat;
          });
        console.log(this.chats);
      },
      error => {
        console.log("Chats error:", error)
      }
    );
  }

  createChat(targetUserId) {
    this.chatService.createChat(targetUserId).subscribe(
      response => {
        console.log("Created chat:", response);

      },
      error => {
        console.log("Chat creation error:", error)
      }
    );
  }

  onChatPage(chatId) {
    this.navCtrl.push(ChatPage, {chatId: chatId});
  }

  onNewChatPage() {
    this.navCtrl.push(ChatNewRecipientPage);
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {
    console.log("Chatlist entered");
    this.getChats();
  }

}
