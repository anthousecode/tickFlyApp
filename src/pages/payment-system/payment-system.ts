import {Component, Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Stripe} from "@ionic-native/stripe";
import {NgForm} from "@angular/forms";
import {ToastService} from "../../services/toast.service";
import {PaymentService} from "../../services/payment.service";
import {LoaderService} from "../../services/loader.service";
import {UserProfilePage} from "../user-profile/user-profile";
import {AuthService} from "../../services/auth.service";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

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
  providers: [ToastService, PaymentService, LoaderService, InAppBrowser, PayPal]
})
export class PaymentSystemPage {
  code: string;
  amount: number;
  paymentSystem: string;
  cvc;
  cardNumber;
  expMonthAndYear;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private stripe: Stripe,
    public toastService: ToastService,
    public paymentService: PaymentService,
    public loadService: LoaderService,
    public authService: AuthService,
    public iab: InAppBrowser,
    private payPal: PayPal
  ) {
    this.paymentSystem = navParams.get('paymentSystem');
    this.code = navParams.get('code');
    this.amount = this.navParams.get('amount');
  }

  browser = this.iab.create('http://anthouse.company/');

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }

  onClickPay() {
    this.stripe.setPublishableKey('pk_live_AqtvkkG9viIkYNpODmItEp60');

    console.log(this.expMonthAndYear);
    let splitString = this.expMonthAndYear.split('-');
    let expMonth = splitString[1];
    let expYear = splitString[0];
    let message: string = '';

    console.log(expMonth);
    console.log(expYear);

    this.validateStripe(expMonth, expYear);

      let card = {
        number: this.cardNumber,
        expMonth: expMonth,
        expYear: expYear,
        cvc: this.cvc
      };

      console.log('Popolnen schet');

      this.loadService.showLoader();

      this.stripe.createCardToken(card)
        .then(token => {
          console.log(token.id);
          this.paymentService.doPayment(token.id, this.amount, this.code)
            .subscribe(
              response => {
                console.log(response.json());
                message = response.json().message;
                this.toastService.showToast(message, 15000);
                this.loadService.hideLoader();
                this.onUserProfile();

              },
              error => {
                console.log(error);
                message = error.json().message;
                this.loadService.hideLoader();
                this.toastService.showToast(message, 15000);
              }
            );
        })
        .catch(error => {
          console.error(error);
          this.loadService.hideLoader();
          message = error.json().message;
          this.toastService.showToast(message);
        });
  }


  validateStripe(expMonth, expYear) {
    this.stripe.validateCardNumber(this.cardNumber)
      .then( res => {
        console.log(res);
      })
      .catch((error: any) => {
        console.log(error);
        this.toastService.showToast('Неверный номер карты!');
      });

    this.stripe.validateExpiryDate(expMonth, expYear)
      .then( res => {
        console.log(res);
      })
      .catch((error: any) => {
        console.log(error);
        this.toastService.showToast('Неверная дата!');
      });

    this.stripe.validateCVC(this.cvc)
      .then( res => {
        console.log(res);
      })
      .catch((error: any) => {
        console.log(error);
        this.toastService.showToast('Неверный cvc!');
      });
  }

  onUserProfile() {
    this.navCtrl.setRoot(UserProfilePage, {userId: this.authService.getUserId()});
  }


  onCreatePayPal() {
    console.log('paypal');
    this.payPal.init({
      PayPalEnvironmentProduction: 'AQ6IFw2QOX3japFtrq6MoIuVPI4he4BW3r80PKfi36YlTzAlX9d9AdRsE-35b7CtyJN5KSi8homcXgka',
      PayPalEnvironmentSandbox: 'EDIworK4fsDiuPYXm-ZxDjf_fUVqSpGFo2xVDBMoKtzwYIv6QDqNu7siaTA7lzGQZzbveIVFSuAznTeO'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.version().then(res => console.log(JSON.stringify(res)));
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(res => {
        console.log(JSON.stringify(res));
        let payment = new PayPalPayment('3.33', 'USD', 'Description', 'sale');
        console.log(JSON.stringify(payment));
        // this.payPal.renderFuturePaymentUI().then(res => {
        //   console.log('success '+ res);
        // })
        this.payPal.renderSinglePaymentUI(payment).then(res => {
          console.log(JSON.stringify(res));
          console.log('success');
          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",io
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, error => {
          console.log(JSON.stringify(error));
          // Error or render dialog closed without being successful
          console.log('Error or render dialog closed without being successful');
        });
      }, () => {
        // Error in configuration
        console.log('Error in configuration');
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
      console.log('Error in initialization, maybe PayPal isn\'t supported or something else');
    })
  }

}
