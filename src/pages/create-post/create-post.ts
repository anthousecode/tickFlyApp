import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpService} from "../../services/http.service";
import {PostService} from "../../services/post.service";
import {NgForm} from "@angular/forms";
import {HomePage} from "../home/home";
import {SearchPage} from "../search/search";
import {ToastService} from "../../services/toast.service";

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
  providers: [PostService, ToastService]
})
export class CreatePostPage {
  public myModel = ''
  categories = [];
  selectedCategories = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpService,
    public postService: PostService,
    public toastService: ToastService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePostPage');
  }

  onChange(selectedCategories) {
    console.log("Selected " + selectedCategories);
    console.log(this);
    if(this.selectedCategories.length <= 2){
      console.log(this.selectedCategories);
    } else {
      console.log(this.selectedCategories);
      return false;
    }
  }

  onSelectItem(selectedItem) {
    console.log("Selected " + selectedItem);
  }

  ngOnInit() {
    this.httpService.getCategories()
      .subscribe(
        response => {
          console.log(response.json());
          this.categories = response.json().category;
        },
        error => {
          console.log(error);
        }
      );
  }

  onCreatePost(form: NgForm) {
    console.log(form.value.title);
    console.log(form.value.description);
    console.log(form.value.selectedCategories);
    console.log(form.value.tags);

    this.postService.createPost(
      form.value.title,
      form.value.description,
      this.selectedCategories,
      form.value.tags
    ).subscribe(
      response => {
        console.log(response.json());
        this.onHomePage();
        this.toastService.showToast('Пост успешно создан!');
      },
      error => {
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
}
