import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {Chat} from "../../models/chat";
import {ChatService} from "../../services/chat.service";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {LoaderService} from "../../services/loader.service";

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chatService: ChatService,
              public authService: AuthService,
              public loadService: LoaderService) {
    this.chat = new Chat();
    this.chat.messages = [];
  }

  ionViewDidLoad() {
    this.userId = Number(this.authService.getUserId());
    this.chatId = this.navParams.get("chatId");
    this.getChat();
  }

  getChat() {
    this.loadService.showLoader();
    this.chatService.getChat(this.chatId).subscribe(
      response => {
        console.log("chat:", response.json());
        this.chat.messages = response.json().messages.map(message => {
          message.userId = message.user_id;
          return message;
        });

        this.chat.title = response.json().messages.filter(message => {
          return message.user_id != this.userId;
        })[0].user.nick_name;
        console.log("title", this.chat.title);

        this.loadService.hideLoader();
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
