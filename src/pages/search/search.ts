import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpService} from "../../services/http.service";
import {PostService} from "../../services/post.service";
import {SearchService} from "../../services/search.service";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
  providers: [PostService, SearchService]
})
export class SearchPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpService,
    public postService: PostService,
    public searchService: SearchService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  posts = [];
  pageNumber: number = 0;
  inputSearch: string;

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    let inputQuery: string = this.inputSearch;
    let section: string = 'posts';

    setTimeout(() => {
      this.postService.getMorePostsOnSearch(inputQuery, this.pageNumber, section).subscribe(
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
              tickCount: post.summ_ticks,
              date: post.format_date,
              media: post.media,
              author: post.user,
              isTick: post.donate
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
    this.pageNumber++;
    console.log(this.pageNumber);
  }

  onInput(event: any) {
    let inputQuery: string = this.inputSearch;
    this.posts = [];
    this.pageNumber = 0;
    console.log(inputQuery);
    this.searchService.getSearchResult(inputQuery)
      .subscribe(
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

}
