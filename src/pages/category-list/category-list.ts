import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CategoryPage} from "../category/category";
import {HttpService} from "../../services/http.service";
import {CreatePostPage} from "../create-post/create-post";

/**
 * Generated class for the CategoryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-list',
  templateUrl: 'category-list.html',
})
export class CategoryListPage {
  categoryList;

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService) {
  }

  ngOnInit() {
    this.httpService.getCategories()
      .subscribe(
        response => {
          this.categoryList = response.json().category;
          console.log(response.json());
        },
        error => {

        }
      );
  }

  itemTapped(event, categoryId) {
    console.log(categoryId);
    this.navCtrl.setRoot(CategoryPage, {
      categoryId: categoryId
    });
  }

  onCreatePostPage() {
    this.navCtrl.push(CreatePostPage);
  }

}
