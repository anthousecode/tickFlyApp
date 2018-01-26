import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserService} from "../../services/user.service";
import {NgForm} from "@angular/forms";
import {ToastService} from "../../services/toast.service";
import {LoaderService} from "../../services/loader.service";

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
  providers: [UserService, ToastService, LoaderService]
})
export class ChangePasswordPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private userService: UserService,
              public toastService: ToastService,
              public loadService: LoaderService) {
  }

  ngOnInit() {
    this.userService.getEditProfile();
  }

  onChangePassword(form: NgForm) {
    this.loadService.showLoader();
    this.userService.changePassword(
      form.value.old_password,
      form.value.new_password,
      form.value.confirmation_password
    ).subscribe(
      response => {
        this.loadService.hideLoader();
        this.toastService.showToast('Пароль успешно изменен!');
      },
      error => {
        this.loadService.hideLoader();
        let errors = error.json().message;
        this.toastService.showToast(errors);
      }
    );
  }

}
