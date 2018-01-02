import {Injectable} from "@angular/core";
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {

  constructor(private toastCtrl: ToastController) { }


  showToast(message: string, duration?: number) {
    duration = duration ? duration : 3000;
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
