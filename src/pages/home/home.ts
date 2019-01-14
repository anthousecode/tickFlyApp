import {Component} from '@angular/core';
import {AlertController, MenuController, NavController} from 'ionic-angular';
import {HttpService} from "../../services/http.service";
import {AuthService} from "../../services/auth.service";
import {PostService} from "../../services/post.service";
import {SocketService} from "../../services/socket.service";
import {LoaderService} from "../../services/loader.service";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HttpService, AuthService, PostService, LoaderService]
})
export class HomePage {
  unreadMessages: number;
  posts = [];
  pageId: number = 0;
  timezone;
  lastPage: boolean = false;

  constructor(public navCtrl: NavController,
              private httpService: HttpService,
              private alertCtrl: AlertController,
              private postService: PostService,
              public menu: MenuController,
              public socketService: SocketService,
              public authService: AuthService,
              public loadService: LoaderService,
              private commonService: CommonService) {
  }

  API = "http://18.219.82.49:8080";

  ngOnInit() {
    this.menu.swipeEnable(true);
    this.loadService.showLoader();
    this.httpService.getPosts().subscribe(
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
        this.loadService.hideLoader();
      },
      error => {
        this.loadService.hideLoader();
      }
    )
  }

  startListening() {
    this.socketService.getMessages().subscribe(data => {
      if (data['data']['targetUserId'] == this.authService.getUserId()) {
        this.unreadMessages += 1;
        localStorage.setItem("unreadMessages", String(this.unreadMessages));
      }
    })
  }

  setTimezone() {
    this.timezone = new Date().toString().split(" ");
    this.timezone = this.timezone[this.timezone.length - 2];
    this.commonService.setTimezone(this.timezone)
      .subscribe(response => {
        },
        error => {
        });
  }

  doInfinite(infiniteScroll) {
    if(!this.lastPage) {
      setTimeout(() => {
        this.postService.getMorePostsOnHome(this.pageId).subscribe(
          response => {
            console.log(response.json());
            let postsList = response.json().posts;
            this.lastPage = response.json().last_page;
            console.log(this.lastPage,response.json().last_page)
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
                media: this.API + post.media,
                author: post.user,
                isTick: post.donate,
                commentsCount: post.comments_count
              });
              // console.log(this.API + post.media);
              // console.log(post);
            }
          },
          error => {
          }
        );
        infiniteScroll.complete();
      }, 500);
    }

    this.pageId++;
  }

}
