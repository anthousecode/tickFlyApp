import {Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import {MultiImageUpload} from "../../components/multi-image-upload/multi-image-upload";
import {HttpService} from "../../services/http.service";
import {PostService} from "../../services/post.service";
import {ToastService} from "../../services/toast.service";
import {LoaderService} from "../../services/loader.service";
import {HomePage} from "../home/home";
import {CreatePostPage} from "../create-post/create-post";

/**
 * Generated class for the CreatePostSecondStepPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-post-second-step',
  templateUrl: 'create-post-second-step.html',
  providers: [
    PostService,
    LoaderService]
})
export class CreatePostSecondStepPage {

  @ViewChild(MultiImageUpload) multiImageUpload: MultiImageUpload;
  protected uploadFinished = false;
  postId: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpService,
    public postService: PostService,
    public toastService: ToastService,
    public loadService: LoaderService,
    public alertCtrl: AlertController
  ) {
    console.log('Hello CreatePostSecondStepComponent Component');
    this.postId = this.navParams.get('postId');
    console.log('postId in constructor after nav params ' + this.postId);
    // this.navCtrl.push(CreatePostSecondStepPage);
  }

  onSubmitUploadImages(postId: number) {
    this.onHomePage();
    this.loadService.hideLoader();
    this.toastService.showToast('Пост успешно создан!');
    this.multiImageUpload.uploadImages(postId).then((images) => {
      // this.uploadFinished = true;
      this.onHomePage();
      this.loadService.hideLoader();
      this.toastService.showToast('Пост успешно создан!');
    }).catch(() => {
      this.onHomePage();
      this.loadService.hideLoader();
      this.toastService.showToast('Пост успешно создан!');
    });
  }
  onFisrtStep(id) {

  }
  onHomePage() {
    this.navCtrl.setRoot(HomePage);
  }
}
