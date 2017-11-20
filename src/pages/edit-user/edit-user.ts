import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from "../../services/user.service";
import {NgForm} from "@angular/forms";

/**
 * Generated class for the EditUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
  providers: [UserService]
})
export class EditUserPage {

  user;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditUserPage');
  }

  ngOnInit() {
    this.userService.getEditProfile()
      .subscribe(
        response => {
          this.user = response.json().user;
        },
        error => {
          console.log(error);
        }
      );
  }

  onChangeUser(form: NgForm) {
    this.userService.changeUser(
      form.value.nick_name,
      form.value.first_name,
      form.value.last_name
    ).subscribe(
      response => {
        console.log('Success');
      },
      error => {
        console.log('Error');
      }
    );
  }

}
