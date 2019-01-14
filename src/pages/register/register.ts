import {Component, ViewChild} from '@angular/core';
import {IonicPage, Nav, NavController, NavParams} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {MyApp} from "../../app/app.component";
import {HomePage} from "../home/home";
import {LoginPage} from "../login/login";
import {ToastService} from "../../services/toast.service";
import {LoaderService} from "../../services/loader.service";
import {DocumentViewer} from "@ionic-native/document-viewer";
import {FileTransfer} from "@ionic-native/file-transfer";
import {File} from "@ionic-native/file";
import { FileOpener } from '@ionic-native/file-opener';
import {Observable} from "rxjs/Rx";
import {Platform} from "ionic-angular";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [ToastService, LoaderService, File, FileOpener, FileTransfer, DocumentViewer]
})
export class RegisterPage {

  chosen: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authService: AuthService,
              public toastService: ToastService,
              public loadService: LoaderService,
              private document: DocumentViewer,
              private file: File,
              private fileOpener: FileOpener,
              private ft: FileTransfer,
              private platfrom: Platform) {
  }

  onHomePage() {
    this.navCtrl.setRoot(HomePage);
  }

  onSignup(form: NgForm) {
    this.loadService.showLoader();
    this.authService.signup(form.value.nickname, form.value.email, form.value.password)
      .subscribe(
        response => {
          this.onHomePage();
          this.authService.getCurrentUserId();
          this.loadService.hideLoader();
          this.toastService.showToast('Вы успешно зарегистрированы!');
        },
        error => {
          this.loadService.hideLoader();
          let errors = error.json().errors;
          let firstError = errors[Object.keys(errors)[0]];
          this.toastService.showToast(firstError);
        }
      );
  }

  openEULA() {
    // this.document.viewDocument('assets/Tuck_Flow_EULA.pdf', 'application/pdf', {});
    // this.fileOpener.open('file:///data/user/0/com.ant.house.tickfly/files/assets/Tuck_Flow_EULA.pdf', 'application/pdf')
    // // this.fileOpener.open(this.file.dataDirectory+'Tuck_Flow_EULA.pdf', 'application/pdf')
    //   .then(() => console.log('File is opened'))
    //   .catch(e => console.log('Error opening file', e));
console.log('fewghweghj');
    let filePath = this.file.applicationDirectory + 'www/assets';

    if (this.platfrom.is('android')){
      let fakeName = Date.now();
      this.file.copyFile(filePath, 'Tuck_Flow_EULA.pdf', this.file.dataDirectory, `${fakeName}.pdf`).then(result => {
        this.fileOpener.open(result.nativeURL, 'application/pdf');
        console.log(result.nativeURL);
      });
    } else {
      this.document.viewDocument(`${filePath}/Tuck_Flow_EULA.pdf`, 'application/pdf', {});
    }

  }
}
