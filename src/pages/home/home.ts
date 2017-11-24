import {Component, EventEmitter, Output} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {PostPage} from "../post/post";
import {HttpService} from "../../services/http.service";
import {AuthService} from "../../services/auth.service";
import {UserProfilePage} from "../user-profile/user-profile";
import {CategoryPage} from "../category/category";
import {CreatePostPage} from "../create-post/create-post";
import {PostService} from "../../services/post.service";

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
    private postService: PostService
  ) {

  }

  posts = [];
  currentPost;

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
          post = response.json().post;
          console.log(post);
          this.navCtrl.push(PostPage, {post: post});
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

  onAuthorPage(userId) {
    this.navCtrl.push(UserProfilePage, {userId: userId});
  }

  onCategoryPage(categoryId) {
    this.navCtrl.push(CategoryPage, {categoryId: categoryId});
  }

  onCreatePostPage() {
    this.navCtrl.push(CreatePostPage);
  }

  showTickAlert(postId: number, userId: number) {
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
                  if(data.tick <= balance && data.tick && Number(data.tick) !== 0 ) {
                    console.log('Saved clicked');
                    this.postService.setTick(postId, userId, data.tick)
                      .subscribe(
                        response => {
                          console.log(response.json());
                          let tickCount = response.json().amount_ticks;
                          this.currentPost = this.posts.find(x => x.postId == postId);
                          this.currentPost.tickCount = tickCount;
                          console.log(this.currentPost.tickCount);
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

}
