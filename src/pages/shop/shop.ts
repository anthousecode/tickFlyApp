import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Stripe} from "@ionic-native/stripe";

/**
 * Generated class for the ShopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html',
})
export class ShopPage {

  payment: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private stripe: Stripe) {
    this.payment = 'input';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
    this.stripe.setPublishableKey('pk_test_hhK8GKGNzqm8BrzrQEDJaf0o');

    let card = {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2020,
      cvc: '220'
    };

    this.stripe.createCardToken(card)
      .then(token => console.log(token.id))
      .catch(error => console.error(error));
  }

  segmentChanged(event) {
    console.log(event);
  }

}
