import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Stripe} from "@ionic-native/stripe";
import {NgForm} from "@angular/forms";
import {PaymentService} from "../../services/payment.service";
import {PaymentSystemPage} from "../payment-system/payment-system";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {UserProfilePage} from "../user-profile/user-profile";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {LoaderService} from "../../services/loader.service";

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
  providers: [PaymentService, InAppBrowser, UserService, AuthService, LoaderService]
})
export class ShopPage {

  payment: string;
  selectedItem: any;
  packageList;
  paymentSystems = [];
  selectedPackage;
  selectedPaymentSystem: string;
  code: string;
  tickCount: number;
  userId: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public paymentService: PaymentService,
    public iab: InAppBrowser,
    public userService: UserService,
    public authService: AuthService,
    public loadService: LoaderService,
  ) {
    this.payment = 'input';
    this.userId = Number(this.authService.getUserId());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShopPage');
  }

  ngOnInit() {
    this.getTickPackages();
    this.getPaymentSystems();
    this.loadService.showLoader();
    this.userService.getProfile(this.userId)
      .subscribe(
        response => {
          console.log(response.json());
          this.tickCount = response.json().user.balance.amount;
          this.loadService.hideLoader();
        },
        error => {
          console.log(error);
          this.loadService.hideLoader();
        }
      );
  }

  segmentChanged(event) {
    console.log(event);
  }

  getTickPackages() {
    if(localStorage.getItem("packageList") && localStorage.getItem("code")) {
      this.packageList = JSON.parse(localStorage.getItem("packageList"));
      this.code = localStorage.getItem("code");
    } else {
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
  }

  getPaymentSystems() {
    this.paymentService.getPaymentMethods()
      .subscribe(
        response => {
          console.log(response.json());
          this.paymentSystems = response.json().payment_systems;
        },
        error => {
          console.log(error);
        }
      );
  }

  openBrowserForPayment() {
    let browser = this.iab.create(this.authService.API + '/shop?id_user=' + this.userId, '',
      {location: 'no', hardwareback: 'no'});
    browser.on('exit').subscribe(
      response => {
        console.log(response);
        this.navCtrl.push(UserProfilePage, {userId: this.authService.getUserId()});
      },
      error => {
        console.log(error);
      })
  }


  onPaymentSystemPage(code, selectedPackage) {
    console.log('code ' + code);
    let tickCount = selectedPackage.split(':')[0];
    let amount = selectedPackage.split(':')[1];
    console.log('tickCount ' + tickCount);
    console.log('amount ' + amount);
    this.paymentService.getPaymentSystemUrl(amount, 'RUB', tickCount).subscribe(
      response => {
        let approvalLink = response.json().approval_link;
        console.log(approvalLink);
        let browser = this.iab.create(approvalLink, '', {location: 'no', hardwareback: 'no'});
        browser.on('exit').subscribe(
          response => {
            console.log(response);
            this.navCtrl.push(UserProfilePage);
          },
          error => {
          console.log(error);
        })
      },
      error => {
        console.log(error);
      }
    );
  }
}
