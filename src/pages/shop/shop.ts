import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Stripe} from "@ionic-native/stripe";
import {NgForm} from "@angular/forms";
import {PaymentService} from "../../services/payment.service";

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
  providers: [PaymentService]
})
export class ShopPage {

  payment: string;
  selectedItem: any;
  packageList = [];
  paymentSystems: { title: string }[] = [
    {'title': 'Stripe'}
  ];
  selectedPackage;
  selectedPaymentSystem: string;
  code: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private stripe: Stripe,
    public paymentService: PaymentService
  ) {
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

  ngOnInit() {
    this.getTickPackages();
  }

  segmentChanged(event) {
    console.log(event);
  }

  getTickPackages() {
    this.paymentService.getPaymentPackages()
      .subscribe(
        response => {
          console.log(response.json());
          this.packageList = response.json().packages[0].cost_ticks;
          this.code = response.json().packages[0].code;
        },
        error => {
          console.log(error);
        }
      );
  }

  onPaymentSystemPage(form: NgForm) {

  }

}
