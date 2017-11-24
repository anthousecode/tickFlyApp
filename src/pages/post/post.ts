import {Component, EventEmitter, Output} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CategoryPage} from "../category/category";
import {NgForm} from "@angular/forms";
import {HttpService} from "../../services/http.service";

/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  post;
  postId: number;
  comments = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private httpService: HttpService
  ) {
    this.post = navParams.get('post');
    this.postId = this.post.id_post;
    this.comments = this.post.comments;
    console.log(this.post.media);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      buttons: ['Подписаться', 'Поделиться', 'Пожаловаться']
    });
    alert.present();
  }

  onCategoryPage(categoryId) {
    this.navCtrl.push(CategoryPage, {categoryId: categoryId});
  }

  concatTag(tag: string) {
    return tag + ' ';
  }

  onSetComment(form: NgForm) {
    console.log(form.value.comment);
    this.httpService.setComment(this.postId, form.value.comment)
      .subscribe(
        response => {
          console.log(response.json());
          this.comments.push(response.json().comment);
          form.reset();
        },
        error => {
          console.log('Error');
        }
      );
  }

}
