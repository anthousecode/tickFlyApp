import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {PostPage} from "../post/post";
import {HttpService} from "../../services/http.service";
import {FollowersPage} from "../followers/followers";
import {FollowedPage} from "../followed/followed";
import {EditUserPage} from "../edit-user/edit-user";
import {ChangePasswordPage} from "../change-password/change-password";
import {CategoryPage} from "../category/category";
import {PostService} from "../../services/post.service";

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
  providers: [UserService, PostService]
})
export class UserProfilePage {

  userId: number = 0;
  posts = [];
  public: boolean = true;
  subscribe;
  user;
  followersCount: number;
  pageId: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userService: UserService,
    public alertCtrl: AlertController,
    public postService: PostService
  ) {
    this.userId = this.navParams.get('userId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

  ngOnInit() {
    this.userService.getProfile(this.userId)
      .subscribe(
        response => {
          console.log(response.json());
          this.user = response.json().user;
          let postsList = response.json().posts;
          this.public = response.json().public;
          this.subscribe = response.json().subscribe;
          this.followersCount = this.user.followers_count;
          for(let index in postsList){
            let post = postsList[index];
            this.posts.push({
              postId: post.id_post,
              title: post.title,
              categories: post.categories,
              description: post.description,
              tags: post.tags,
              tickCount: post.summ_ticks,
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

  showAlert() {
    let alert = this.alertCtrl.create({
      buttons: ['Подписаться', 'Поделиться', 'Пожаловаться']
    });
    alert.present();
  }

  onFollowersPage(userId) {
    let followersList;
    this.userService.getFollowers(userId)
      .subscribe(
        response => {
          followersList = response.json().followers;
          this.navCtrl.push(FollowersPage, {followersList: followersList});
        },
        error => {
          console.log();
        }
      );
  }

  onFollowedPage(userId) {
    let followedList;
    this.userService.getFollowed(userId)
      .subscribe(
        response => {
          followedList = response.json().followed;
          this.navCtrl.push(FollowedPage, {followedList: followedList});
        },
        error => {
          console.log();
        }
      );
  }

  onToggleSubscribe(userId) {
    this.userService.toggleSubscribe(userId)
      .subscribe(
        response => {
          console.log(response.json());
          this.followersCount = response.json().followers_count;
          console.log(this.followersCount);
        },
        error => {
          console.log('error');
        }
      )
  }

  onEditUserPage() {
    this.navCtrl.push(EditUserPage);
  }

  onChangePasswordPage() {
    this.navCtrl.push(ChangePasswordPage);
  }

  showAlertUserEdit() {
    let alert = this.alertCtrl.create({
      buttons: [
        {
          text: 'Редактировать профиль',
          handler: () => {
            this.onEditUserPage();
          }
        },
        {
          text: 'Изменить пароль',
          handler: () => {
            this.onChangePasswordPage();
          }
        }
      ]
    });
    alert.present();
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.postService.getMorePostsOnCategory(this.userId, this.pageId).subscribe(
        response => {
          console.log(response.json());
          let postsList = response.json().posts;
          for(let index in postsList){
            let post = postsList[index];
            this.posts.push({
              postId: post.id_post,
              title: post.title,
              categories: post.categories,
              description: post.description,
              tags: post.tags,
              tickCount: post.summ_ticks,
              date: post.format_date,
              media: post.media,
              author: post.user
            });
          }
        },
        error => {
          console.log(error);
        }
      )

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
    this.pageId++;
    console.log(this.pageId);
  }
}
