import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ToastService} from "../../services/toast.service";
import {PaymentService} from "../../services/payment.service";
import {LoaderService} from "../../services/loader.service";
import {UserProfilePage} from "../user-profile/user-profile";
import {AuthService} from "../../services/auth.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";

/**
 * Generated class for the PaymentSystemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-system',
  templateUrl: 'payment-system.html',
  providers: [ToastService, PaymentService, LoaderService, InAppBrowser]
})
export class PaymentSystemPage {
  code: string;  amount: number;
  paymentSystem: string;
  cvc;
  cardNumber;
  expMonthAndYear;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastService: ToastService,
              public loadService: LoaderService,
              public authService: AuthService,
              public iab: InAppBrowser,) {
    this.paymentSystem = navParams.get('paymentSystem');
    this.code = navParams.get('code');
    this.amount = this.navParams.get('amount');
  }

  onClickPay() {
  }

  onUserProfile() {
    this.navCtrl.push(UserProfilePage, {userId: this.authService.getUserId()});
  }

}
