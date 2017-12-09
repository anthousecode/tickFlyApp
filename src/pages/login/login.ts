import {Component, ViewChild} from '@angular/core';
import {
  AlertController, IonicPage, ModalController, Nav, NavController, NavParams, Platform, ToastController,
  ViewController
} from 'ionic-angular';

import {RegisterPage} from "../register/register";
import {AuthService} from "../../services/auth.service";
import {NgForm} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {HomePage} from "../home/home";
import {GooglePlus} from "@ionic-native/google-plus";
import {ToastService} from "../../services/toast.service";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService, GooglePlus, ToastService],
})
export class LoginPage {

  rootPage: any = null;

  userData = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthService,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public _sanitizer: DomSanitizer,
              public toastCtrl: ToastController,
              public googlePlus: GooglePlus,
              public toastService: ToastService) {
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
    console.log(form.value.email);
    console.log(form.value.password);
    this.authService.signin(form.value.email, form.value.password).subscribe(
      response => {
        console.log('Success');
        this.onHomePage();
        this.authService.getCurrentUserId();
        this.toastService.showToast('Вы успешно авторизированы!');
      },
      error => {
        console.log('Error');
        let errors = error.json().errors;
        let firstError = errors[Object.keys(errors)[0]];
        this.toastService.showToast(firstError);
      }
    );
  }

  signinGoogle() {


    console.log('test login');
    this.googlePlus.login({
      "webClientId": "61123529027-an619isno3lndv76lci95dam2pmrvgd4.apps.googleusercontent.com",
    })
      .then(res => {
        let toast = this.toastCtrl.create({
          message: "Success " + res,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      })
      .catch(err => {
        let toast = this.toastCtrl.create({
          message: "Error " + err,
          duration: 3000,
          position: 'top'
        });
        toast.present();

      });
    // this.authService.signinGoogle().subscribe(
    //   response => {
    //     console.log('Success');
    //     console.log(response.text());
    //     let htmlAlert = response.text();
    //     this.presentModal(htmlAlert);
    //     // this.showPromptGoogle(htmlAlert);
    //   },
    //   error => {
    //     console.log('Error');
    //   }
    // );
  }

  // showPromptGoogle(html: string) {
  //   let testString = this._sanitizer.bypassSecurityTrustHtml(html).toString();
  //   let prompt = this.alertCtrl.create({
  //     title: 'Login',
  //     message: testString
  //   });
  //   prompt.present();
  // }
}
