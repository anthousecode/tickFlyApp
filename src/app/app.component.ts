import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {AlertController, Nav, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {LoginPage} from '../pages/login/login';
import {HttpService} from "../services/http.service";
import {AuthService} from "../services/auth.service";
import {UserProfilePage} from "../pages/user-profile/user-profile";
import {CategoryListPage} from "../pages/category-list/category-list";

@Component({
  templateUrl: 'app.html',
  providers: [HttpService, AuthService]
})

@Injectable()
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  logged: boolean = false;

  pages: Array<{ title: string, component: any }>;

  userId = this.getUserId();


  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private authService: AuthService
  ) {
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Главная', component: HomePage},
      {title: 'Категории', component: CategoryListPage}
    ];

  }

  ngOnInit() {
    console.log("Ng on init in app");
    console.log("Not ready on ", Date.now().toString());

    this.platform.ready().then(() => {
      console.log("Ready on ", Date.now().toString());
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    })
  }

  ngDoCheck() {
    this.logged = this.authService.isLogin();
    if (this.logged == true) {
      this.rootPage = HomePage;
    }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  onLoginPage() {
    this.nav.push(LoginPage);
  }

  onUserProfile() {
    this.nav.setRoot(UserProfilePage, {userId: this.getUserId()});
  }

  logout() {
    this.authService.logout();
    this.onLoginPage();
  }

  getUserId() {
    return localStorage.getItem('id_user');
  }
}
