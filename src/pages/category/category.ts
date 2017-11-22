import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PostPage} from "../post/post";
import {HttpService} from "../../services/http.service";

/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  categoryId: number;
  category;
  posts = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService) {
    this.categoryId = this.navParams.get('categoryId');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

  ngOnInit() {
    this.httpService.getCategory(this.categoryId)
      .subscribe(
        response => {
          console.log(response.json());
          this.category = response.json().category;
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
      );
  }

  onPostPage(postId) {
    let post;
    this.httpService.getPost(postId)
      .subscribe(
        response => {
          post = response.json().post;
          this.navCtrl.push(PostPage, {post: post});
        },
        error => {
          console.log(error);
        }
      );
  }

}
