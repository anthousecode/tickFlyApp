import {Component, Provider} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {Chat} from "../../models/chat";
import {ChatService} from "../../services/chat.service";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {LoaderService} from "../../services/loader.service";
import {User} from "../../models/user";
import {Message} from "../../models/message";
import {SocketService} from "../../services/socket.service";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [ChatService, LoaderService],
})
export class ChatPage {
  chat: Chat;
  chatId: number;
  userId: number;
  interlocutor: User;
  messageListener;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chatService: ChatService,
              public authService: AuthService,
              public loadService: LoaderService,
              public socketService: SocketService) {
    this.chat = new Chat();
    this.chat.messages = [];
    this.interlocutor = new User();
  }

  ionViewDidLoad() {
    this.userId = Number(this.authService.getUserId());
    this.chatId = this.navParams.get("chatId");
    this.getChat();
  }

  destroyListeners() {
    this.messageListener.unsubscribe();
  }

  ionViewDidLeave() {
    console.log("Listeners destroyed");
    this.destroyListeners();
  }

  startListening() {
    console.log('startListening');
    this.messageListener = this.socketService.getMessages().subscribe(data => {
      // TODO: KEK LEL TOP TIER MEMES
      let messageData = data['data'];
      console.log('startListening');
      console.log('senderID ' + messageData['senderId']);
      console.log('interlocator ' + this.interlocutor.id);
      console.log('data chatID ' + data['chatID']);
      console.log('chatID ' + this.chatId);
      // if (messageData['senderId'] == this.interlocutor.id && data['chatId'] == this.chatId) {
      if (messageData['senderId'] == this.interlocutor.id && messageData['chatId'] == this.chatId) {
        let msg = new Message();
        msg.message = messageData['text'];
        msg.userId = messageData['senderId'];
        msg.message_type = "text";
        msg.createdAt = messageData['createdAt']
        this.chat.messages.push(msg);
        console.log('push to array');
      }
    });
    this.chat.messages = this.chat.messages.reverse();
    console.log(this.chat.messages);
  }


  getChat() {
    console.log('getChat');
    const lStorageKey = "chatMessages_" + this.chatId;
    if (localStorage.getItem(lStorageKey)) {
      this.chat.messages = JSON.parse(localStorage.getItem(lStorageKey));
    } else {
      this.loadService.showLoader();
    }

    this.chatService.getChat(this.chatId).subscribe(
      response => {
        this.chat.messages = response.json().messages.map(message => {
          message.userId = message.user_id;
          message.createdAt = message.format_time;
          return message;
        });
        localStorage.setItem(lStorageKey, JSON.stringify(this.chat.messages));
        let interlocutor = response.json().members.filter(member => {
          return member.user.id_user != this.userId;
        })[0];

        this.interlocutor.id = interlocutor.user.id_user;
        this.interlocutor.avatar = interlocutor.user.avatar;
        this.interlocutor.firstName = interlocutor.user.first_name;
        this.interlocutor.lastName = interlocutor.user.last_name;
        this.interlocutor.nickname = interlocutor.user.nick_name;
        this.interlocutor.email = interlocutor.user.email;
        this.loadService.hideLoader();
        this.startListening();
      },
      error => {
        this.loadService.hideLoader();
      }
    )
    this.chat.messages = this.chat.messages.reverse();
    console.log(this.chat.messages);
  }


  sendMessage(form: NgForm) {
    console.log(form.value.message);

    let currentdate = new Date();
    let currentDatetime = currentdate.getHours() + ":" + (currentdate.getMinutes()<10?'0':'') + currentdate.getMinutes() ;
    console.log('datetime');
    console.log(currentDatetime);
    this.chatService.sendMessage(this.chatId, form.value.message)
      .subscribe(
        response => {
          this.socketService.emitChatMessage(form.value.message, this.chatId, this.userId, this.interlocutor.id, currentDatetime);
          this.chat.messages.push({
              userId: Number(this.userId),
              message: form.value.message,
              createdAt: currentDatetime
            }
          );
          form.reset();
        },
        error => {
          console.log('Error');
        }
      );
  }
}
