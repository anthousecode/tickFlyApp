import {Component, ViewChild,ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavController, NavParams,AlertController} from 'ionic-angular';
import {HttpService} from "../../services/http.service";
import {PostService} from "../../services/post.service";
import {NgForm} from "@angular/forms";
import {HomePage} from "../home/home";
import {ToastService} from "../../services/toast.service";
import {LoaderService} from "../../services/loader.service";
import {MultiImageUpload} from "../../components/multi-image-upload/multi-image-upload";
import {CreatePostSecondStepPage} from "../create-post-second-step/create-post-second-step";
import { Slides } from 'ionic-angular';

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
  @ViewChild(Slides) slides: Slides;
  public myModel = '';
  categories = [];
  selectedCategories = [];
  page: number = 1;
  secondStep = false;
  canLeave = false;
  test = 0;
  @ViewChild(MultiImageUpload) multiImageUpload: MultiImageUpload;
  protected uploadFinished = false;
  isFirstStep: boolean = true;
  postId: number;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public httpService: HttpService,
              public postService: PostService,
              public toastService: ToastService,
              public loadService: LoaderService,
              public ref: ChangeDetectorRef,
              public alertCtrl: AlertController) {
    this.postId = this.navParams.get('postId');
    console.log('return first step',this.postId)

  }

  onChange(selectedCategories) {
    if (this.selectedCategories.length <= 2) {
    } else {
      return false;
    }
  }
  goSecondStep(form: NgForm) {
    console.log(this.postId)
    this.slides.lockSwipeToNext(false);
    console.log(this.postId);
    if(this.postId) {
      this.postService.updatePost(
        form.value.title,
        form.value.description,
        this.selectedCategories,
        form.value.tags,
        this.postId
      ).subscribe(
        response => {

          this.loadService.hideLoader();
          this.slides.slideNext();
          this.page ++ ;
          this.secondStep = true;
        },
        error => {
          this.loadService.hideLoader();
          let errors = error.json().errors;
          let firstError = errors[Object.keys(errors)[0]];
          this.toastService.showToast(firstError);
        }
      )
    } else {
     this.postService.createPost(
       form.value.title,
       form.value.description,
       this.selectedCategories,
       form.value.tags
     ).subscribe(
       response => {
         const postId = response.json().id_post;
         // this.onSubmitUploadImages(postId);
         this.postId =  postId;
         console.log('postId in request ' + postId);
         this.loadService.hideLoader();
         this.slides.slideNext();
         this.page ++ ;
         this.secondStep = true;
       },
       error => {
         this.loadService.hideLoader();
         let errors = error.json().errors;
         let firstError = errors[Object.keys(errors)[0]];
         this.toastService.showToast(firstError);
       }
     )
   }
  }
  goBack() {

  if(this.page > 1) {
    this.slides.lockSwipeToPrev(false);
    this.slides.slidePrev();
    this.secondStep = false;
    // this.ref.detectChanges();
  }
  }
  onSelectItem(selectedItem) {
  }
  slideChanged(){
    if(this.slides.isBeginning()) {

      this.slides.lockSwipeToNext(true);
      this.slides.lockSwipeToPrev(true);

    }
    else  {
      this.slides.lockSwipeToPrev(true);
    }
  }
  onSubmitPost(postId: number) {
    this.onHomePage();
    this.loadService.hideLoader();
    this.canLeave = true;

  }
  ngOnInit() {
    this.slides.lockSwipeToPrev(true);
    this.slides.lockSwipeToNext(true);
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
    // this.loadService.showLoader();
    console.log('second-step')


  }

  _keyPress(event: any) {
    const pattern = /[а-яa-z1-9\\#\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  ionViewCanLeave():boolean{
    console.log(this.canLeave);
    if(this.canLeave) {
      return this.canLeave;
    } else {
      this.leaveCreatePost();
      return this.canLeave;
    }

  }
  leaveCreatePost(){

    this.test ++;
    let alert = this.alertCtrl.create({
      title: 'Вы хотите отменить создание поста?',
      message: '',
      buttons: [{
        text: "Да",
        handler: () => {
          this.deletePost(this.postId);
          this.canLeave = true;
          this.onHomePage()
        }
      }, {
        text: "Нет",
        role: 'cancel',
        handler:() => {
          this.canLeave = false;
        }
      }]
    });
    alert.present();

    return this.canLeave;

  }
  deletePost(postId) {
    if(postId) {
      this.postService.deletePost(postId).subscribe(
        data => {console.log()},
        error => {

        }
      )
    }
  }

  onSecondStep(postId) {
    this.navCtrl.push(CreatePostSecondStepPage, {postId: postId});
  }

  onHomePage() {
      this.navCtrl.goToRoot(HomePage)
  }
}
