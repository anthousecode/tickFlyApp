import {Component, EventEmitter, Output} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {PostPage} from "../post/post";
import {User} from "../../shared/user";
import {HttpService} from "../../services/http.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HttpService, AuthService]
})
export class HomePage {

  constructor(public navCtrl: NavController, private httpService: HttpService) {

  }

  users: User[] = [];

  posts = [];

  ngOnInit(){
    this.httpService.getPosts().subscribe(
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

}
