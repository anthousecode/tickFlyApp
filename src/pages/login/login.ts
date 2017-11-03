import {Component, ViewChild} from '@angular/core';
import {IonicPage, Nav, NavController, NavParams} from 'ionic-angular';

import {RegisterPage} from "../register/register";
import {AuthService} from "../../services/auth.service";
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {NgForm} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService],
})
export class LoginPage {
  @ViewChild(Nav) nav: Nav;

  userData = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthService, public facebook: Facebook) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  onRegisterPage() {
    this.navCtrl.push(RegisterPage);
    //this.authService.login();
  }

  onSignup(form: NgForm) {
    console.log(form.value.email);
    console.log(form.value.password);
    this.authService.signup(form.value.email, form.value.password)
      .subscribe(
        response => {
          // this.notificationsService.add(new Notification('success', 'User successfully registered!'));
          // this.router.navigate(['/signin']);
          console.log('Success');
        },
        error => {
          // this.alertService.error(error);
          console.log('Error');
        }
      );
  }

  // loginWithFB() {
  // loginWithFB() {
  //   this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
  //     this.facebook.api('me?fields=id,email,first_name', []).then(profile => {
  //       this.userData = {email: profile['email'], first_name: profile['first_name'], username: profile['name']};
  //     })
  //   });
  // }

}