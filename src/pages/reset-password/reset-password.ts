import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {NgForm} from "@angular/forms";
import {ToastService} from "../../services/toast.service";
import {LoaderService} from "../../services/loader.service";
import {LoginPageModule} from "../login/login.module";
import {LoginPage} from "../login/login";

/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
  providers: [
    AuthService,
    ToastService,
    LoaderService
  ]
})
export class ResetPasswordPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public toastService: ToastService,
    public loadService: LoaderService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

  onLoginPage() {
    this.navCtrl.setRoot(LoginPage);
  }

  sendLetterToUser(form: NgForm) {
    this.authService.resetPassword(form.value.email).subscribe(
      success => {
        this.onLoginPage();
        this.loadService.hideLoader();
        let successMessage = success.json().success;
        let firstSuccessMessage = successMessage[Object.keys(successMessage)[0]];
        this.toastService.showToast(firstSuccessMessage);
      },
      error => {
        this.loadService.hideLoader();
        let errors = error.json().errors;
        let firstError = errors[Object.keys(errors)[0]];
        this.toastService.showToast(firstError);
      }
    );
  }

}
