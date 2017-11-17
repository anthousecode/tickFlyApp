import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {PostPage} from "../post/post";
import {HttpService} from "../../services/http.service";

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
  providers: [UserService]
})
export class UserProfilePage {

  userId = this.getUserId();
  posts = [];
  user;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authService: AuthService,
              private userService: UserService,
              public alertCtrl: AlertController,
              private httpService: HttpService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

  onPostPage(postId) {
    let post;
    this.httpService.getPost(postId)
      .subscribe(
        response => {
          console.log(response.json().post);
          post = response.json().post;
          this.navCtrl.push(PostPage, {post: post});
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnInit() {
    this.userService.getProfile(this.userId)
      .subscribe(
        response => {
          console.log(response.json());
          this.user = response.json().user;
          let postsList = response.json().posts;
          for(let index in postsList){
            let post = postsList[index];
            this.posts.push({
              postId: post.id_post,
              title: post.title,
              categories: post.categories,
              description: post.description,
              tags: post.tags,
              tickCount: post.ticks_count,
              date: post.format_date,
              media: post.media
            });
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  getUserId() {
    return localStorage.getItem('id_user');
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      buttons: ['Подписаться', 'Поделиться', 'Пожаловаться']
    });
    alert.present();
  }
}
