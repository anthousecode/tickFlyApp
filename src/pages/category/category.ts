import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/http.service";
import {PostService} from "../../services/post.service";
import {LoaderService} from "../../services/loader.service";

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
  providers: [PostService, LoaderService]
})
export class CategoryPage {

  categoryId: number = 0;
  category;
  posts = [];
  pageId: number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private httpService: HttpService,
              private postService: PostService,
              public loadService: LoaderService) {
    this.categoryId = this.navParams.get('categoryId');
  }

  ngOnInit() {
    this.loadService.showLoader();
    this.httpService.getCategory(this.categoryId)
      .subscribe(
        response => {
          this.category = response.json().category;
          let postsList = response.json().posts;
          for (let index in postsList) {
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
              isTick: post.donate,
              commentsCount: post.comments_count
            });
          }
          this.loadService.hideLoader();
        },
        error => {
          this.loadService.hideLoader();
        }
      );
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.postService.getMorePostsOnCategory(this.categoryId, this.pageId).subscribe(
        response => {
          let postsList = response.json().posts;
          for (let index in postsList) {
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
              isTick: post.donate,
              commentsCount: post.comments_count
            });
          }
        },
        error => {
        }
      );
      infiniteScroll.complete();
    }, 500);
    this.pageId++;
  }

}
