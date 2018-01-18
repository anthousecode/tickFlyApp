import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {LoginPage} from '../pages/login/login';
import {HttpService} from "../services/http.service";
import {AuthService} from "../services/auth.service";
import {UserProfilePage} from "../pages/user-profile/user-profile";
import {CategoryListPage} from "../pages/category-list/category-list";
import {ShopPage} from "../pages/shop/shop";
import {SocketService} from "../services/socket.service";
import {ChatListPage} from "../pages/chat-list/chat-list";
import {PaymentService} from "../services/payment.service";
import {CommonService} from "../services/common.service";


@Component({
  templateUrl: 'app.html',
  providers: [HttpService, AuthService, PaymentService, CommonService]
})

@Injectable()
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  logged: boolean = false;
  pages: Array<{ title: string, component: any }>;
  userId: number;
  newMessages: number = 0;
  newMessageCount: number = 0;
  messagesLabel: string;
  timezone;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private authService: AuthService,
              private socketService: SocketService,
              private paymentService: PaymentService,
              private commonService: CommonService) {
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Главная', component: HomePage},
      {title: 'Категории', component: CategoryListPage},
      {title: 'Магазин тиков', component: ShopPage}
    ];
    this.userId = Number(this.authService.getUserId());
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.socketService.connect();
      this.startListening();
      this.getTickPackages();
      this.setTimezone();
    })
  }

  startListening() {
    this.socketService.getMessages().subscribe(data => {
      console.log('AppComponent Listener ');
      console.log(data);
      if (data['data']['targetUserId'] == this.authService.getUserId()) {
        this.newMessageCount += 1;
        console.log('newMessageCount ' + this.newMessageCount);
        localStorage.setItem("unreadMessages", String(this.newMessageCount));
      }
      // if (data['senderId'] == this.interlocutor.id && data['chatId'] == this.chatId) {
      //   let msg = new Message();
      //   msg.message = data['text'];
      //   msg.message_type = "text";
      //   this.chat.messages.push(msg);
      // }
    });
  }

  ngDoCheck() {
    this.logged = this.authService.isLogin();
    if (this.logged == true) {
      this.rootPage = HomePage;
    }
    this.newMessageCount = Number(localStorage.getItem("unreadMessages"));
  }

  setTimezone() {
    this.timezone = new Date().toString().split(" ");
    this.timezone = this.timezone[this.timezone.length - 2];
    this.commonService.setTimezone(this.timezone)
      .subscribe( response => {
        console.log(response);
      },
        error => {
        console.log(error);
      });
  }

  getTickPackages() {
    this.paymentService.getPaymentPackages()
      .subscribe(
        response => {
          console.log(response.json());
          let packageList = response.json().packages[0].cost_ticks;
          let code = response.json().packages[0].code;
          console.log("code " + code);
          localStorage.setItem("packageList", JSON.stringify(packageList));
          localStorage.setItem("code", code);
        },
        error => {
          console.log(error);
        }
      );
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  onLoginPage() {
    this.nav.push(LoginPage);
  }

  onChatPage() {
    this.nav.push(ChatListPage);
  }

  onUserProfile() {
    this.nav.setRoot(UserProfilePage, {userId: this.authService.getUserId()});
  }

  logout() {
    this.authService.logout();
    this.onLoginPage();
  }
}
