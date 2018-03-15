import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {LoaderService} from "../../services/loader.service";
import {ToastService} from "../../services/toast.service";
import {PostService} from "../../services/post.service";
import {HttpService} from "../../services/http.service";
import {NavController, NavParams} from "ionic-angular";
import {MultiImageUpload} from "../multi-image-upload/multi-image-upload";
import {NgForm} from "@angular/forms";

/**
 * Generated class for the CreatePostFirstStepComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'create-post-first-step',
  templateUrl: 'create-post-first-step.html'
})
export class CreatePostFirstStepComponent {

  public myModel = '';
  categories = [];
  selectedCategories = [];

  @Input() isFirstStep: boolean;
  @Output() userNameChange = new EventEmitter<boolean>();
  onNameChange(change: any){
    this.userNameChange.emit(change);
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpService,
    public postService: PostService,
    public toastService: ToastService,
    public loadService: LoaderService
  ) {
    console.log('Hello CreatePostFirstStepComponent Component');
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
        // this.onSubmitUploadImages(postId);
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

}
