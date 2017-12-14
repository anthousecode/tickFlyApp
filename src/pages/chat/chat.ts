import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {Chat} from "../../models/chat";
import {ChatService} from "../../services/chat.service";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {LoaderService} from "../../services/loader.service";
import {Socket} from 'ng-socket-io';
import {Observable} from "rxjs/Observable";
import {User} from "../../models/user";

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [ChatService, LoaderService]
})
export class ChatPage {
  chat: Chat;
  chatId: number;
  userId: number;
  interlocutor: User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chatService: ChatService,
              public authService: AuthService,
              public loadService: LoaderService,
              public socket: Socket) {
    this.chat = new Chat();
    this.chat.messages = [];
    this.interlocutor = new User();

  }

  ionViewDidLoad() {
    this.userId = Number(this.authService.getUserId());
    this.chatId = this.navParams.get("chatId");

    this.socket.connect();
    this.socket.on("init", (res) => {
      console.log("INIT EBAT", res);
    });
    this.getChat();

  }

  ionViewDidLeave() {
    this.socket.disconnect();
  }

  getMessages(userId) {
    let observable = new Observable(observer => {
      this.socket.on('message_' + userId, (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  startListening(userId) {
    this.getMessages(userId).subscribe(message => {
      console.log("Message", message);
    });
    console.log("Subscribed to :" + userId);
  }

  getChat() {
    this.loadService.showLoader();
    this.chatService.getChat(this.chatId).subscribe(
      response => {
        this.chat.messages = response.json().messages.map(message => {
          message.userId = message.user_id;
          return message;
        });
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
        this.startListening(this.interlocutor.id);
      },
      error => {
        this.loadService.hideLoader();
      }
    )
  }

  sendMessage(form: NgForm) {
    console.log(form.value.message);
    this.chatService.sendMessage(this.chatId, form.value.message)
      .subscribe(
        response => {
          console.log(response.json());
          this.chat.messages.push({
              userId: Number(this.userId),
              message: form.value.message
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
