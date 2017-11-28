import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpService} from "../../services/http.service";

/**
 * Generated class for the CreatePostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-post',
  templateUrl: 'create-post.html',
})
export class CreatePostPage {

  categories = [];
  selectedCategories = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public httpService: HttpService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePostPage');
  }

  onChange(selectedCategories) {
    console.log("Selected " + selectedCategories);
    console.log(this);
    if(this.selectedCategories.length <= 2){
      console.log(this.selectedCategories);
    } else {
      return false;
    }
  }

  onSelectItem(selectedItem) {
    console.log("Selected " + selectedItem);
  }

  ngOnInit() {
    this.httpService.getCategories()
      .subscribe(
        response => {
          console.log(response.json());
          this.categories = response.json().category;
        },
        error => {
          console.log(error);
        }
      );
  }

}
