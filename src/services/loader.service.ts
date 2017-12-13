import {Injectable} from "@angular/core";
import {Loading, LoadingController, ToastController} from 'ionic-angular';

@Injectable()
export class LoaderService {
  loading: Loading;

  constructor(private loadingCtrl: LoadingController) {
  }

  showLoader(content: string = null) {
    this.loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: content ? content : 'Loading, Please Wait...'
    });
    this.loading.present();
  }

  hideLoader() {
    this.loading.dismiss();
  }
}
