import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {PostPage} from "../post/post";

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
  nickname;
  avatar;
  fullname;
  status;
  postCount;
  subscribersCount;
  subscriptionsCount;
  posts = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authService: AuthService,
              private userService: UserService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

  onPostPage() {
    this.navCtrl.push(PostPage);
  }

  ngOnInit() {
    this.userService.getProfile(this.userId)
      .subscribe(
        response => {
          console.log(response.json());
          this.nickname = response.json().user.nick_name;
          this.avatar =  response.json().user.avatar;
          this.fullname = response.json().user.first_name + ' ' + response.json().user.last_name;
          this.postCount = response.json().user.posts_count;
          this.subscribersCount = response.json().user.followers_count;
          this.subscriptionsCount = response.json().user.followed_count;
          let postsList = response.json().posts;
          for(let index in postsList){
            let post = postsList[index];
            this.posts.push({
              id: post.id_post,
              title: post.title,
              categories: post.categories,
              description: post.description,
              tags: post.tags,
              tickCount: post.ticks_count,
              date: post.format_date,
              media: post.media
            });
          }
          console.log(this.posts);
        }
      );
  }

  getUserId() {
    return localStorage.getItem('id_user');
  }
}
