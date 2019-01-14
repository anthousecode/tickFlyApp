import {Component, HostListener, Provider, ViewChild,ChangeDetectorRef} from "@angular/core";
import {Content, IonicPage, NavController, NavParams} from "ionic-angular";
import {Chat} from "../../models/chat";
import {ChatService} from "../../services/chat.service";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {LoaderService} from "../../services/loader.service";
import {User} from "../../models/user";
import {Message} from "../../models/message";
import {SocketService} from "../../services/socket.service";
import {PostPage} from "../post/post";
import {HttpService} from "../../services/http.service";
import {UserProfilePage} from "../user-profile/user-profile";
import {ToastService} from "../../services/toast.service";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [ChatService, LoaderService, HttpService],
})
export class ChatPage {
  chat: Chat;
  chatId: number;
  chatAvatar: string;
  chatTitle: string;
  userId: number;
  interlocutor: User;
  messageListener;
  unreadMessageCount;
  @ViewChild(Content) content: Content;
  pageNumber: number;
  isScrollable: boolean;
  isLoading: boolean;
  loadMoreMessages = [0];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public chatService: ChatService,
              public authService: AuthService,
              public loadService: LoaderService,
              public socketService: SocketService,
              public httpService: HttpService,
              public ref: ChangeDetectorRef,
              public toast: ToastService) {

    this.chat = new Chat();
    this.chat.messages = [];
    this.interlocutor = new User();
    this.pageNumber = 0;
    this.isScrollable = false;
    this.isLoading = false;
  }

  API = "http://18.219.82.49:3001";

  ionViewDidLoad() {
    this.userId = Number(this.authService.getUserId());
    this.chatId = this.navParams.get("chatId");
    this.chatAvatar = this.navParams.get("chatAvatar");
    this.chatTitle = this.navParams.get("chatTitle");
    this.getChat();
    // this.scrollToBottom();
    this.socketService.triggerStatusMessage();
  }

  destroyListeners() {
    this.messageListener.unsubscribe();
  }

  ionViewDidLeave() {
    this.destroyListeners();
  }

  listenChangeStatusMessage() {
    this.socketService.getStatusMessage().subscribe(
      data => {
        console.log('log before log data');
        console.log(data);
      }
    );
    console.log('listenChangeStatusMessage()');
  }

  startListening() {
    this.messageListener = this.socketService.getMessages().subscribe(data => {
      // TODO: KEK LEL TOP TIER MEMES
      console.log('startListening');
      let messageData = data['data'];
      this.socketService.triggerStatusMessage();
      if (messageData['senderId'] == this.interlocutor.id && messageData['chatId'] == this.chatId) {
        let msg = new Message();
        console.log(messageData);
        console.log(messageData['text']);
        msg.postId = messageData['id_post'];
        msg.message = messageData['text'];
        msg.userId = messageData['senderId'];
        msg.messageType = messageData['messageType'];
        msg.createdAt = messageData['createdAt'];
        msg.read = true;
        this.chat.messages.push(msg);
        this.scrollToBottom();
      }
    });
    this.chat.messages = this.chat.messages.reverse();
    this.scrollToBottom();
  }


  getChat() {
    console.log('getChat');
    const lStorageKey = "chatMessages_" + this.chatId;
    if (localStorage.getItem(lStorageKey)) {
      this.chat.messages = JSON.parse(localStorage.getItem(lStorageKey));
    } else {
      this.loadService.showLoader();
    }
    this.chatService.getChat(this.chatId, this.pageNumber).subscribe(
      response => {
        console.log(this.chatId);
        console.log(response.json().messages);
        this.chat.messages = response.json().messages.map(message => {
          message.userId = message.user_id;
          message.createdAt = message.format_time;
          message.messageType = message.message_type;
          message.read = message.read;
          message.postId = message.message.id_post ? message.message.id_post : '';
          message.message = message.message.title ? message.message.title : message.message;
          return message;
        });
        localStorage.setItem(lStorageKey, JSON.stringify(this.chat.messages));
        let interlocutor = response.json().members.filter(member => {
          return member.user.id_user != this.userId;
        })[0];

        this.unreadMessageCount = response.json().count_unread_message;
        localStorage.setItem("unreadMessages", this.unreadMessageCount);

        this.interlocutor.id = interlocutor.user.id_user;
        this.interlocutor.avatar = interlocutor.user.avatar;
        this.interlocutor.firstName = interlocutor.user.first_name;
        this.interlocutor.lastName = interlocutor.user.last_name;
        this.interlocutor.nickname = interlocutor.user.nick_name;
        this.interlocutor.email = interlocutor.user.email;
        this.loadService.hideLoader();
        this.listenChangeStatusMessage();
        this.startListening();
        this.scrollToBottom();
        this.isScrollable = false;
        this.pageNumber++;
      },
      error => {
        this.loadService.hideLoader();
      }
    );
    this.chat.messages = this.chat.messages.reverse();
    console.log(this.chat.messages);
  }


  sendMessage(form: NgForm) {
    console.log('sendMessage');
    let currentdate = new Date();
    let currentDatetime = currentdate.getHours() + ":" + (currentdate.getMinutes() < 10 ? '0' : '') + currentdate.getMinutes();
    this.chatService.sendMessage(this.chatId, form.value.message)
      .subscribe(
        response => {
          this.socketService.emitChatMessage(form.value.message, this.chatId, this.userId, this.interlocutor.id, currentDatetime, 'text');
          this.chat.messages.push({
              userId: Number(this.userId),
              message: form.value.message,
              createdAt: currentDatetime,
              messageType: 'text',
              read: false
            }
          );
          form.reset();
          this.scrollToBottom();
        },
        error => {
          this.showAlertAboutBlock(error.json().message);
        }
      );
  }


  onPostPage(postId) {
    this.loadService.showLoader();
    let post;
    this.httpService.getPost(postId)
      .subscribe(
        response => {
          post = response.json().post;
          this.navCtrl.push(PostPage, {post: post});
          this.loadService.hideLoader();
        },
        error => {
          this.loadService.hideLoader();
        }
      );
  }

  checkScroll(){
    this.isScrollable = this.content.scrollTop == 0;
    this.ref.detectChanges();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  onUserprofilePage() {
    this.navCtrl.push(UserProfilePage, {userId: this.interlocutor.id});
  }

  loadMoreMessage() {
    console.log(this.content.scrollTop);
    console.log('pageNumber: ' + this.pageNumber);
    console.log(this.isLoading);
    if(this.content.scrollTop == 0) {
      this.isLoading = true;
      console.log(this.isLoading);
      this.chatService.getChat(this.chatId, this.pageNumber).subscribe(
        response => {
          console.log(response.json());
          const messageList = response.json().messages;
          console.log(messageList);
          this.loadMoreMessages = messageList;
          for (let index in messageList) {
            const message = messageList[index];
            message.userId = message.user_id;
            message.createdAt = message.format_time;
            message.messageType = message.message_type;
            message.read = message.read;
            message.postId = message.message.id_post ? message.message.id_post : '';
            message.message = message.message.title ? message.message.title : message.message;
            this.chat.messages.unshift(message);
          }
          this.isLoading = false;
          this.pageNumber++;
        },
        error => {
          console.log('error');
          this.isLoading = false;
        }
      );
      console.log(this.isLoading);
    }
  }

  showAlertAboutBlock(message) {
    this.toast.showToast(message,3000);
  }

}
