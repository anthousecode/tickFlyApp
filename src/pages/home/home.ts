import {Component, EventEmitter, Output} from '@angular/core';
import {AlertController, MenuController, NavController} from 'ionic-angular';
import {PostPage} from "../post/post";
import {HttpService} from "../../services/http.service";
import {AuthService} from "../../services/auth.service";
import {UserProfilePage} from "../user-profile/user-profile";
import {CategoryPage} from "../category/category";
import {CreatePostPage} from "../create-post/create-post";
import {PostService} from "../../services/post.service";
import {SearchPage} from "../search/search";
import {ChatListPage} from "../chat-list/chat-list";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HttpService, AuthService, PostService]
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private httpService: HttpService,
    private alertCtrl: AlertController,
    private postService: PostService,
    public menu: MenuController
  ) {

  }

  posts = [];
  pageId: number = 0;

  ngOnInit(){
    this.menu.swipeEnable(true);
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
            author: post.user,
            isTick: post.donate
          });
          console.log(post.donate);
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.postService.getMorePostsOnHome(this.pageId).subscribe(
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

  onCreatePostPage() {
    this.navCtrl.push(CreatePostPage);
  }

  onChatsListPage() {
    this.navCtrl.push(ChatListPage);
  }

  onSearchPage() {
    this.navCtrl.push(SearchPage);
  }

}
