import {Component, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, MenuController, ModalController, Nav, NavController, NavParams, Platform, ToastController,
  ViewController
} from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import {RegisterPage} from "../register/register";
import {AuthService} from "../../services/auth.service";
import {NgForm} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public toastCtrl: ToastController,
    public googlePlus: GooglePlus,
    public toastService: ToastService,
    public menu: MenuController,
    public loadService: LoaderService,
    private fb: Facebook
  ) {
    this.rootPage = null;
    this.userData = null;
  }

  ngOnInit() {
    this.menu.close();
    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onRegisterPage() {
    this.navCtrl.push(RegisterPage);
  }

  onHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  onSignin(form: NgForm) {
    this.loadService.showLoader();
    console.log(form.value.email);
    console.log(form.value.password);
    this.authService.signin(form.value.email, form.value.password).subscribe(
      response => {
        console.log('Success');
        this.onHomePage();
        this.authService.getCurrentUserId();
        this.loadService.hideLoader();
        this.toastService.showToast('Вы успешно авторизированы!');
      },
      error => {
        console.log('Error');
        this.loadService.hideLoader();
        let errors = error.json().errors;
        let firstError = errors[Object.keys(errors)[0]];
        this.toastService.showToast(firstError);
      }
    );
  }

  signinGoogle() {
    console.log('test login');
    this.googlePlus.login({})
    // this.googlePlus.trySilentLogin({
    //   "webClientId": "1069051362186-c9dvj0j6cgv69ki9giqtu75gr16r132o.apps.googleusercontent.com"
    // })
    //   this.googlePlus.getSigningCertificateFingerprint()
      .then(res => {
        console.log(JSON.stringify(res));
        this.authService.signinGoogle(res.email, res.userId, res.displayName, res.familyName, res.givenName)
          .subscribe(response => {
            console.log('SUCCESS')
            console.log(response.json().access_token);
            let token = response.json().access_token;
            localStorage.setItem("token", token);
            this.onHomePage();
            this.authService.getCurrentUserId();
            this.toastService.showToast('Вы успешно авторизированы!');
          },
          error => {
            console.log('error' + error);
          })

      })
      .catch(err => {
        console.log(JSON.stringify(err));
      });
  }

  signinFacebook() {
    console.log('signinFacebook Begin');
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        console.log('Logged into Facebook!', res);
        let accessToken = res.authResponse.accessToken;
        console.log(accessToken);
        this.authService.signinFacebook(accessToken)
          .subscribe( response => {
            let token = response.json().access_token;
            localStorage.setItem("token", token);
            console.log('signinFacebookSuccess');

            this.onHomePage();
            this.authService.getCurrentUserId();
            this.toastService.showToast('Вы успешно авторизированы!');
          },
          error => {
            console.log(JSON.stringify(error));
          })
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }
}
