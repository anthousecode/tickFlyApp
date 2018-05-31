import {Component, ViewChild} from '@angular/core';
import {LoaderService} from "../../services/loader.service";
import {ToastService} from "../../services/toast.service";
import {PostService} from "../../services/post.service";
import {HttpService} from "../../services/http.service";
import {NavController, NavParams} from "ionic-angular";
import {MultiImageUpload} from "../multi-image-upload/multi-image-upload";
import {HomePage} from "../../pages/home/home";

/**
 * Generated class for the CreatePostSecondStepComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'create-post-second-step',
  templateUrl: 'create-post-second-step.html'
})
export class CreatePostSecondStepComponent {

  @ViewChild(MultiImageUpload) multiImageUpload: MultiImageUpload;
  protected uploadFinished = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpService,
    public postService: PostService,
    public toastService: ToastService,
    public loadService: LoaderService
  ) {
    console.log('Hello CreatePostSecondStepComponent Component');
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

  onHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

}
