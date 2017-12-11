import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {ShareService} from "../../services/share.service";
import {AuthService} from "../../services/auth.service";

/**
 * Generated class for the SharingFollowersListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sharing-followers-list',
  templateUrl: 'sharing-followers-list.html',
  providers: [ShareService, AuthService]
})
export class SharingFollowersListPage {

  selectedItem: any;
  followersList = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public shareService: ShareService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharingFollowersListPage');
  }

  ngOnInit() {
    this.shareService.getFollowers()
      .subscribe(
        response => {
          console.log(response.json());
          this.followersList = response.json().subscribers;
        },
        error => {

        }
      )
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  itemTapped(event, idUser) {
    console.log(idUser);
  }

}
