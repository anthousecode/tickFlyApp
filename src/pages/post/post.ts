import {Component, EventEmitter, Output} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CategoryPage} from "../category/category";
import {NgForm} from "@angular/forms";
import {HttpService} from "../../services/http.service";
import {UserProfilePage} from "../user-profile/user-profile";
import {PostService} from "../../services/post.service";
import {AuthService} from "../../services/auth.service";
import {CreatePostPage} from "../create-post/create-post";
import {SearchPage} from "../search/search";

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
  providers: [PostService]
})
export class PostPage {

  post;
  postId: number;
  comments = [];
  posts = [];
  currentUserId: number;
  isTick: boolean;
  comment: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private httpService: HttpService,
              public postService: PostService,
              public authService: AuthService) {
    this.post = navParams.get('post');
    this.postId = this.post.id_post;
    this.isTick = this.post.donate;
    this.comments = this.post.comments;
    this.currentUserId = Number(this.authService.getUserId());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      cssClass: 'alert-capabilities',
      buttons: ['Поделиться', 'Пожаловаться']
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

  onAuthorPage(userId) {
    this.navCtrl.push(UserProfilePage, {userId: userId});
  }

  showTickAlert(postId: number, userId: number) {
    console.log(postId, userId);
    this.postService.getBalance()
      .subscribe(
        response => {
          let balance = response.json().balance;
          let prompt = this.alertCtrl.create({
            title: 'Тик',
            message: 'Количество тиков на Вашем счету ' + balance + '<p>Введите количество тиков</p>',
            inputs: [
              {
                name: 'tick',
                placeholder: 'Tick',
                type: 'number'
              },
            ],
            buttons: [
              {
                text: 'Отмена',
                handler: data => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Сохранить',
                handler: data => {
                  if (data.tick <= balance && data.tick && Number(data.tick) !== 0) {
                    console.log('Saved clicked');
                    this.postService.setTick(postId, userId, data.tick)
                      .subscribe(
                        response => {
                          console.log(response.json());
                          let tickCount = response.json().amount_ticks;
                          this.post.tickCount = tickCount;
                          this.isTick = true;
                          console.log(this.post.tickCount);
                        }
                      );
                  } else {
                    return false;
                  }
                }
              }
            ]
          });
          prompt.present();
        }
      )
  }

  onCreatePostPage() {
    this.navCtrl.push(CreatePostPage);
  }

  onSearchPage() {
    this.navCtrl.push(SearchPage);
  }

}
