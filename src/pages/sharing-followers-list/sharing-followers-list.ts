import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

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
})
export class SharingFollowersListPage {

  selectedItem: any;
  followersList = [];
  followedList;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharingFollowersListPage');
  }

  ngOnInit() {
    
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  itemTapped(event, idUser) {
    console.log(idUser);
  }

}
