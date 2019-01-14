import {Component, Input} from '@angular/core';
import {PostPage} from "../../pages/post/post";
import {AlertController, ModalController, NavController, ViewController} from "ionic-angular";
import {UserProfilePage} from "../../pages/user-profile/user-profile";
import {CategoryPage} from "../../pages/category/category";
import {CreatePostPage} from "../../pages/create-post/create-post";
import {HttpService} from "../../services/http.service";
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {SharingFollowersListPage} from "../../pages/sharing-followers-list/sharing-followers-list";
import {ToastService} from "../../services/toast.service";
import {LoaderService} from "../../services/loader.service";

/**
 * Generated class for the PostPreviewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'post-preview',
  templateUrl: 'post-preview.html',
  providers: [UserService, ToastService, LoaderService]
})
export class PostPreviewComponent {

  @Input() publicProfile: boolean;
  @Input() userId: number;
  @Input() categoryId: number;
  @Input() posts = [];
  currentPost;
  currentPage: string;
  user;
  currentUserId: number;
  isTick: boolean;

  constructor(public navCtrl: NavController,
              private httpService: HttpService,
              private alertCtrl: AlertController,
              private postService: PostService,
              public viewCtrl: ViewController,
              public authService: AuthService,
              public modalCtrl: ModalController,
              public userService: UserService,
              public toastService: ToastService,
              public loadService: LoaderService) {
    this.currentPage = this.viewCtrl.name;
    this.currentUserId = Number(this.authService.getUserId());
    this.isTick = false;
  }

  API = "http://18.219.82.49:8080";

  onPostPage(postId) {
    this.loadService.showLoader();
    let post;
    this.httpService.getPost(postId)
      .subscribe(
        response => {
          post = response.json().post;
          this.navCtrl.push(PostPage, {post: post});
          this.loadService.hideLoader();
        },
        error => {
          this.loadService.hideLoader();
        }
      );
  }

  showPostAlert(postId, authorId, post) {
    let alert = this.alertCtrl.create({
      cssClass: 'alert-capabilities',
      buttons: [
        {
          text: 'Поделиться',
          cssClass: 'hidden',
          handler: () => {
            this.presentProfileModal(postId, post);
          }
        }
      ]
    });
    if (this.currentUserId === authorId) {
      alert.addButton({
        text: 'Удалить',
        handler: () => {
          this.postService.deletePost(postId)
            .subscribe(
              response => {
                this.posts = this.posts.filter(x => x.postId !== postId);
                this.toastService.showToast('Пост успешно удален!');
              },
              error => {
              }
            );
        }
      });
    } else {
      alert.addButton({
        text: 'Пожаловаться',
        handler: () => {
          this.presentComplaintPrompt(postId, authorId);
        }
      });
    }
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

  getShortDescription(description: string) {
    let shortDescription: string;
    if (description.length >= 120) {
      shortDescription = description.slice(0, 120) + '...';
    } else {
      shortDescription = description;
    }
    return shortDescription;
  }

  showTickAlert(postId: number, userId: number) {
    this.postService.getBalance()
      .subscribe(
        response => {
          let balance = response.json().balance;
          let prompt = this.alertCtrl.create({
            title: 'Тук',
            message: 'Количество туков на Вашем счету ' + balance + '<p>Введите количество туков</p>',
            cssClass: 'alert-spend-tick',
            inputs: [
              {
                name: 'tick',
                placeholder: 'Tuck',
                type: 'number'
              },
            ],
            buttons: [
              {
                text: 'Отмена',
                handler: data => {
                }
              },
              {
                text: 'Сохранить',
                handler: data => {
                  if (data.tick <= balance && data.tick && Number(data.tick) !== 0) {
                    this.postService.setTick(postId, userId, data.tick)
                      .subscribe(
                        response => {
                          let tickCount = response.json().amount_ticks;
                          this.currentPost = this.posts.find(x => x.postId == postId);
                          this.currentPost.tickCount = tickCount;
                          this.currentPost.isTick = true;
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


  presentProfileModal(postId, post) {
    let profileModal = this.modalCtrl.create(SharingFollowersListPage, {postId: postId, post: post});
    profileModal.onDidDismiss(data => {
    });
    profileModal.present();
  }

  presentComplaintPrompt(postId, authorId) {
    let complaintReasons = [];
    let reasonId: number;
    this.userService.getComplaintReasons()
      .subscribe(
        response => {
          let complaints = response.json().complaints;
          for (let index in complaints) {
            let reason = complaints[index];
            complaintReasons.push({
              id: reason.id,
              label: reason.description,
              type: 'radio',
              handler: () => {
                reasonId = reason.id;
              }
            })
          }
          let alert = this.alertCtrl.create({
            title: 'Пожаловаться',
            message: 'Укажите причину:',
            inputs: complaintReasons,
            buttons: [
              {
                text: 'Отмена',
                role: 'cancel',
                handler: data => {
                }
              },
              {
                text: 'Подтвердить',
                handler: data => {
                  this.userService.setComplaintReason(postId, authorId, reasonId)
                    .subscribe(
                      response => {
                        this.toastService.showToast('Вы пожаловались на пользователя!');
                      },
                      error => {
                      }
                    )
                }
              }
            ]
          });
          alert.present();
        },
        error => {
        }
      );

  }

}
