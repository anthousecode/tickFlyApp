import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {AlertController, Nav, Platform} from 'ionic-angular';
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
import {ChatService} from "../services/chat.service";
import {Network} from "@ionic-native/network";
import {ToastService} from "../services/toast.service";


@Component({
  templateUrl: 'app.html',
  providers: [HttpService, AuthService, PaymentService, CommonService, ChatService, Network, ToastService]
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
  timezone;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private authService: AuthService,
              private socketService: SocketService,
              private paymentService: PaymentService,
              private commonService: CommonService,
              private chatService: ChatService,
              private network: Network,
              private alertCtrl: AlertController,
              private toastService: ToastService) {
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Категории', component: CategoryListPage},
      {title: 'Магазин туков', component: ShopPage}
    ];
    this.userId = Number(this.authService.getUserId());
  }

  ngOnInit() {
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.presentInternetCheckAlert();
    });
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if(this.network.type != 'none') {
        this.socketService.connect();
        this.getUnreadMessages();
        this.startListening();
        this.setTimezone();
      }
    });
  }

  startListening() {
    this.socketService.getMessages().subscribe(data => {
      if (data['data']['targetUserId'] == this.authService.getUserId()) {
        console.log(this.newMessageCount);
        this.newMessageCount += 1;
        localStorage.setItem("unreadMessages", String(this.newMessageCount));
      }
    });
  }

  ngDoCheck() {
    this.logged = this.authService.isLogin();
    if (this.logged == true) {
      this.rootPage = HomePage;
    }
    this.newMessageCount = Number(localStorage.getItem("unreadMessages"));
  }

  getUnreadMessages() {
    this.chatService.getChats().subscribe(
      response => {
        let unreadMessage = JSON.parse(response.text()).count_unread_message;
        localStorage.setItem("unreadMessages", unreadMessage);
      }
    );
  }

  setTimezone() {
    // this.timezone = new Date().toString().split(" ");
    // this.timezone = this.timezone[this.timezone.length - 2];
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.commonService.setTimezone(this.timezone)
      .subscribe(response => {
        },
        error => {
        });
  }

  getTickPackages() {
    this.paymentService.getPaymentPackages()
      .subscribe(
        response => {
          let packageList = response.json().packages[0].cost_ticks;
          let code = response.json().packages[0].code;
          localStorage.setItem("packageList", JSON.stringify(packageList));
          localStorage.setItem("code", code);
        },
        error => {
        }
      );
  }

  presentInternetCheckAlert() {
    let alert = this.alertCtrl.create({
      title: 'Внимание!',
      message: 'Ваше устройство не подключено к интеренету. Для дальнейшего использования подключите устрйосвто к интернету и перезапустите приложение',
      buttons: ['OK']
    });
    alert.present();
    alert.onDidDismiss(res => {
      setTimeout(() => {
        this.platform.exitApp();
      }),
        500
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  onHomePage() {
    this.nav.setRoot(HomePage);
  }

  onLoginPage() {
    this.nav.push(LoginPage);
  }

  onChatPage() {
    this.nav.push(ChatListPage);
  }

  onUserProfile() {
    this.nav.push(UserProfilePage, {userId: Number(this.authService.getUserId())});
  }

  logout() {
    this.authService.logout();
    this.onLoginPage();
  }
}
