import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../services/http.service";
import {PostService} from "../../services/post.service";
import {NgForm} from "@angular/forms";
import {HomePage} from "../home/home";
import {ToastService} from "../../services/toast.service";
import {LoaderService} from "../../services/loader.service";
import {MultiImageUpload} from "../../components/multi-image-upload/multi-image-upload";

/**
 * Generated class for the CreatePostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-post',
  templateUrl: 'create-post.html',
  providers: [PostService, ToastService, LoaderService]
})
export class CreatePostPage {
  public myModel = '';
  categories = [];
  selectedCategories = [];
  @ViewChild(MultiImageUpload) multiImageUpload: MultiImageUpload;
  protected uploadFinished = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public httpService: HttpService,
              public postService: PostService,
              public toastService: ToastService,
              public loadService: LoaderService) {
  }

  onChange(selectedCategories) {
    if (this.selectedCategories.length <= 2) {
    } else {
      return false;
    }
  }

  onSelectItem(selectedItem) {
  }

  ngOnInit() {
    this.httpService.getCategories()
      .subscribe(
        response => {
          this.categories = response.json().category;
        },
        error => {
        }
      );
  }

  onCreatePost(form: NgForm) {
    this.loadService.showLoader();

    this.postService.createPost(
      form.value.title,
      form.value.description,
      this.selectedCategories,
      form.value.tags
    ).subscribe(
      response => {
        let postId = response.json().id_post;
        this.onSubmitUploadImages(postId);
      },
      error => {
        this.loadService.hideLoader();
        let errors = error.json().errors;
        let firstError = errors[Object.keys(errors)[0]];
        this.toastService.showToast(firstError);
      }
    )
  }

  _keyPress(event: any) {
    const pattern = /[а-яa-z1-9\\#\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  onHomePage() {
    this.navCtrl.setRoot(HomePage);
  }


  onSubmitUploadImages(postId: number) {
    this.multiImageUpload.uploadImages(postId).then((images) => {
      this.uploadFinished = true;
      this.onHomePage();
      this.loadService.hideLoader();
      this.toastService.showToast('Пост успешно создан!');
    }).catch(() => {
      this.onHomePage();
      this.loadService.hideLoader();
      this.toastService.showToast('Пост успешно создан!');
    });
  }
}
