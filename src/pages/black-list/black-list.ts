import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProfilePage} from "../user-profile/user-profile";

/**
 * Generated class for the FollowedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-black-list',
  templateUrl: 'black-list.html',
})
export class BlackListPage {

  selectedItem: any;
  icons: string[];
  followersList = [];
  followedList;
  blackList;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.blackList = navParams.get('blackList');

  }

  API = "http://18.219.82.49:8080";

  itemTapped(event, idUser) {
    this.navCtrl.push(UserProfilePage, {
      userId: idUser
    });
  }

}
