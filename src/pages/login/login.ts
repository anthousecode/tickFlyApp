import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook';

import {RegisterPage} from "../register/register";
import {AuthService} from "../../services/auth.service";
import {NgForm} from "@angular/forms";
import {HomePage} from "../home/home";
import {GooglePlus} from "@ionic-native/google-plus";
import {ToastService} from "../../services/toast.service";
import {LoaderService} from "../../services/loader.service";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService, GooglePlus, ToastService, LoaderService, Facebook]
})
export class LoginPage {

  rootPage: any;
  userData;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthService,
              public toastCtrl: ToastController,
              public googlePlus: GooglePlus,
              public toastService: ToastService,
              public menu: MenuController,
              public loadService: LoaderService,
              private fb: Facebook) {
    this.rootPage = null;
    this.userData = null;
  }

  ngOnInit() {
    this.menu.close();
    this.menu.swipeEnable(false);
  }

  onRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  onHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  onSignin(form: NgForm) {
    this.loadService.showLoader();
    this.authService.signin(form.value.email, form.value.password).subscribe(
      response => {
        this.onHomePage();
        this.authService.getCurrentUserId();
        this.loadService.hideLoader();
        this.toastService.showToast('Вы успешно авторизированы!');
      },
      error => {
        this.loadService.hideLoader();
        let errors = error.json().errors;
        let firstError = errors[Object.keys(errors)[0]];
        this.toastService.showToast(firstError);
      }
    );
  }

  signinGoogle() {
    this.googlePlus.login({})
      .then(res => {
        this.authService.signinGoogle(res.email, res.userId, res.displayName, res.familyName, res.givenName)
          .subscribe(response => {
              let token = response.json().access_token;
              localStorage.setItem("token", token);
              this.onHomePage();
              this.authService.getCurrentUserId();
              this.toastService.showToast('Вы успешно авторизированы!');
            },
            error => {
            })

      })
      .catch(err => {
      });
  }

  signinFacebook() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        let accessToken = res.authResponse.accessToken;
        this.authService.signinFacebook(accessToken)
          .subscribe(response => {
              let token = response.json().access_token;
              localStorage.setItem("token", token);

              this.onHomePage();
              this.authService.getCurrentUserId();
              this.toastService.showToast('Вы успешно авторизированы!');
            },
            error => {
            })
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }
}
