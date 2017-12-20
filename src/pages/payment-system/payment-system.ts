import {Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Stripe} from "@ionic-native/stripe";
import {NgForm} from "@angular/forms";
import {ToastService} from "../../services/toast.service";

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
  providers: [ToastService]
})
export class PaymentSystemPage {
  code: string;
  amount: number;
  paymentSystem: string;
  cvc;
  cardNumber;
  expMonthAndYear;

  constructor(public navCtrl: NavController, public navParams: NavParams, private stripe: Stripe, public toastService: ToastService) {
    this.paymentSystem = navParams.get('paymentSystem');
    this.code = navParams.get('code');
    this.amount = this.navParams.get('amount');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }

  onClickPay() {
    this.stripe.setPublishableKey('pk_test_hhK8GKGNzqm8BrzrQEDJaf0o');

    console.log(this.expMonthAndYear);
    let splitString = this.expMonthAndYear.split('-');
    let expMonth = splitString[1];
    let expYear = splitString[0];

    console.log(expMonth);
    console.log(expYear);

    this.stripe.validateCardNumber(this.cardNumber)
      .then( res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
        this.toastService.showToast('Неверный номер карты!')
      });

    this.stripe.validateExpiryDate(expMonth, expYear)
      .then( res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
        this.toastService.showToast('Неверная дата!')
      });

    this.stripe.validateCVC(this.cvc)
      .then( res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
        this.toastService.showToast('Неверный cvc!')
      });

    let card = {
      number: this.cardNumber,
      expMonth: expMonth,
      expYear: expYear,
      cvc: this.cvc
    };

    this.stripe.createCardToken(card)
      .then(token => {
        console.log(token.id);
      })
      .catch(error => console.error(error));
  }

}
