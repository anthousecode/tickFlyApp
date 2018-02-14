import {Component, ViewChild} from '@angular/core';
import {AlertController, Content, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {CategoryPage} from "../category/category";
import {NgForm} from "@angular/forms";
import {HttpService} from "../../services/http.service";
import {UserProfilePage} from "../user-profile/user-profile";
import {PostService} from "../../services/post.service";
import {AuthService} from "../../services/auth.service";
import {SearchPage} from "../search/search";
import {SharingFollowersListPage} from "../sharing-followers-list/sharing-followers-list";
import {UserService} from "../../services/user.service";
import {ToastService} from "../../services/toast.service";
import {HomePage} from "../home/home";

/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
  providers: [PostService, UserService, ToastService]
})
export class PostPage {

  post;
  postId: number;
  comments = [];
  posts = [];
  currentUserId: number;
  isTick: boolean;
  comment: string;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private httpService: HttpService,
              public postService: PostService,
              public authService: AuthService,
              public modalCtrl: ModalController,
              public userService: UserService,
              public toastService: ToastService) {
    this.post = navParams.get('post');
    this.postId = this.post.id_post;
    this.isTick = this.post.donate;
    this.comments = this.post.comments;
    this.currentUserId = Number(this.authService.getUserId());
  }

  showPostAlert(postId, authorId) {
    let alert = this.alertCtrl.create({
      cssClass: 'alert-capabilities',
      buttons: [
        {
          text: 'Поделиться',
          cssClass: 'hidden',
          handler: () => {
            this.presentProfileModal(postId);
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
                this.navCtrl.setRoot(HomePage);
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

  onCategoryPage(categoryId) {
    this.navCtrl.push(CategoryPage, {categoryId: categoryId});
  }

  concatTag(tag: string) {
    return tag + ' ';
  }

  onSetComment(form: NgForm) {
    this.httpService.setComment(this.postId, form.value.comment)
      .subscribe(
        response => {
          this.comments.push(response.json().comment);
          form.reset();
          this.scrollToBottom();
        },
        error => {
        }
      );
  }

  onAuthorPage(userId) {
    this.navCtrl.push(UserProfilePage, {userId: userId});
  }

  showTickAlert(postId: number, userId: number) {
    this.postService.getBalance()
      .subscribe(
        response => {
          let balance = response.json().balance;
          let prompt = this.alertCtrl.create({
            title: 'Тук',
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
                          this.post.tickCount = tickCount;
                          this.isTick = true;
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

  presentProfileModal(postId) {
    console.log('presentProfileModal postId ' + postId);
    let profileModal = this.modalCtrl.create(SharingFollowersListPage, {postId: postId, post: this.post});
    profileModal.onDidDismiss(data => {
      console.log('data onDidDismiss ' + data);
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

  onSearchPage(tag) {
    this.navCtrl.push(SearchPage, {query: tag});
  }


  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  onUserprofilePage(userId) {
    this.navCtrl.push(UserProfilePage, {userId: userId});
  }

}
