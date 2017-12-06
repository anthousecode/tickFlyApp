import {Component, Input} from '@angular/core';
import {PostPage} from "../../pages/post/post";
import {AlertController, NavController, ViewController} from "ionic-angular";
import {UserProfilePage} from "../../pages/user-profile/user-profile";
import {CategoryPage} from "../../pages/category/category";
import {CreatePostPage} from "../../pages/create-post/create-post";
import {HttpService} from "../../services/http.service";
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";

/**
 * Generated class for the PostPreviewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'post-preview',
  templateUrl: 'post-preview.html',
  providers: [UserService]
})
export class PostPreviewComponent {

  @Input() publicProfile: number;
  @Input() userId: number;
  @Input() categoryId: number;
  @Input() posts = [];
  currentPost;
  currentPage: string;
  user;
  currentUserId: number;
  isTick: boolean = false;

  constructor(
    public navCtrl: NavController,
    private httpService: HttpService,
    private alertCtrl: AlertController,
    private postService: PostService,
    public viewCtrl: ViewController,
    public authService: AuthService
  ) {
    this.currentPage = this.viewCtrl.name;
    this.currentUserId = Number(this.authService.getUserId());
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

  getAuthorId(post) {
    if (this.currentPage == 'UserProfilePage') {
      return this.userId;
    } else {
      return post.author.id_user;
    }
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
                          this.currentPost.isTick = true;
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
