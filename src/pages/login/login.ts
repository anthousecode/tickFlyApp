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

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService],
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
              public toastCtrl: ToastController) {
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
    this.authService.signin(form.value.email, form.value.password)
      .subscribe(
        response => {
          console.log('Success');
          this.onHomePage();
          this.authService.presentSuccessToast();
        },
        error => {
          console.log('Error');
          this.authService.presentUnsuccessToast();
        }
      );
  }

  signinGoogle() {
    console.log('test login');
    this.authService.signinGoogle().subscribe(
      response => {
        console.log('Success');
        console.log(response.text());
        let htmlAlert = response.text();
        this.presentModal(htmlAlert);
        // this.showPromptGoogle(htmlAlert);
      },
      error => {
        console.log('Error');
      }
    );
  }

  // showPromptGoogle(html: string) {
  //   let testString = this._sanitizer.bypassSecurityTrustHtml(html).toString();
  //   let prompt = this.alertCtrl.create({
  //     title: 'Login',
  //     message: testString
  //   });
  //   prompt.present();
  // }

  presentModal(html: string) {
    let modal = this.modalCtrl.create(ModalContentPage, {html: html});
    modal.present();
  }

}



@Component({
  template: `
<ion-header>
  <ion-toolbar>
    <ion-title>
      Google Auth
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
  <div [innerHtml]="htmlProperty"></div>
</ion-content>
`
})

export class ModalContentPage {

  private _htmlProperty: string = '';

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    private _sanitizer: DomSanitizer
  ) {
    this._htmlProperty = params.get('html');
  }

  public get htmlProperty() : SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(this._htmlProperty);
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }
}
