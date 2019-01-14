import {Component, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ActionSheetController, Platform} from "ionic-angular";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";
import {TransferObject} from "@ionic-native/transfer";
import {ToastService} from "../../services/toast.service";
import {AuthService} from "../../services/auth.service";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'multi-image-upload',
  templateUrl: 'multi-image-upload.html',
  providers: [Camera, File, FilePath, Platform, AuthService, LoaderService]
})

export class MultiImageUpload {
  public serverUrl = `${this.authService.API}/api/v1/post/save-media`;

  public isUploading = false;
  public uploadingProgress = {};
  public uploadingHandler = {};
  public images: any = [];
  protected imagesValue: Array<any>;
  public hasImages: boolean = true;
  @Input() postId: number;

  constructor(private sanitization: DomSanitizer,
              private actionSheetCtrl: ActionSheetController,
              private camera: Camera,
              public toastService: ToastService,
              public authService: AuthService,
              public loadService: LoaderService) {
  }

  public uploadImages(postId: number): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      this.isUploading = true;
      Promise.all(this.images.map(image => {
        return this.uploadImage(image, postId);
      }))
        .then(resolve)
        .catch(reason => {
          this.isUploading = false;
          this.uploadingProgress = {};
          this.uploadingHandler = {};
          reject(reason);
        });

    });
  }

  public abort() {
    if (!this.isUploading)
      return;
    this.isUploading = false;
    for (let key in this.uploadingHandler) {
      this.uploadingHandler[key].abort();
    }
  }

  protected removeImage(image) {
    if (this.isUploading)
      return;
    this.util.removeFromArray(this.imagesValue, image);
    this.util.removeFromArray(this.images, image.url);
  }

  protected showAddImage() {
    if (!window['cordova']) {
      let input = document.createElement('input');
      input.type = 'file';
      input.accept = "image/x-png,image/gif,image/jpeg";
      input.click();
      input.onchange = () => {
        let blob = window.URL.createObjectURL(input.files[0]);
        this.images.push(blob);
        this.uploadImage(blob, this.postId);
        this.util.trustImages();
      }
    } else {
      new Promise((resolve, reject) => {
        let actionSheet = this.actionSheetCtrl.create({
          title: 'Добавить изображение',
          buttons: [
            {
              text: 'Загрузить из галереи',
              handler: () => {
                resolve(this.camera.PictureSourceType.PHOTOLIBRARY);
              }
            },
            {
              text: 'Камера',
              handler: () => {
                resolve(this.camera.PictureSourceType.CAMERA);
              }
            },
            {
              text: 'Отмена',
              role: 'cancel',
              handler: () => {
                reject();
              }
            }
          ]
        });
        actionSheet.present();
      }).then(sourceType => {
        if (!window['cordova'])
          return;
        let options: CameraOptions = {
          quality: 100,
          sourceType: sourceType as number,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };
        this.camera.getPicture(options).then((imagePath) => {
          this.uploadImage(imagePath, this.postId);
          this.images.push(imagePath);
          this.util.trustImages();
        });
      }).catch(() => {
      });
    }
  }


  public uploadImage(targetPath, postId) {
    console.log(targetPath);
    return new Promise((resolve, reject) => {
      this.uploadingProgress[targetPath] = 0;

      if (window['cordova']) {
        let options = {
          fileKey: "post_media",
          fileName: targetPath,
          chunkedMode: false,
          httpMethod: "post",
          mimeType: "image/*",
          params: {
            id_post: postId
          },
          headers: {
            "Authorization": 'Bearer ' + this.authService.getToken()
          }
        };
        const fileTransfer = new TransferObject();
        this.uploadingHandler[targetPath] = fileTransfer;

        console.log('before fileTransfer.upload()',targetPath, this.serverUrl, options);
        fileTransfer.upload(targetPath, this.serverUrl, options).then(data => {
          resolve(JSON.parse(data.response));
          console.log('fileTransfer.upload() onfulfilled');
          this.isUploading = false;
        }).catch(error => {
          console.log(error);
          console.log('fileTransfer.upload() onrejected');
          this.isUploading = false;
          this.uploadingProgress = {};
          this.uploadingHandler = {};
          this.toastService.showToast('Ошибка загрузки изображения!');
          this.loadService.hideLoader();
        });

        console.log('after upload() ');
        fileTransfer.onProgress(event2 => {
          console.log('onProgress() ');
          this.uploadingProgress[targetPath] = event2.loaded * 100 / event2.total;
          console.log(this.uploadingProgress[targetPath]);
        });
      } else {
        console.log('not cordova');
        const xhr = new XMLHttpRequest();
        xhr.open('POST', targetPath, true);
        xhr.responseType = 'blob';
        xhr.onload = (e) => {
          if (xhr['status'] != 200) {
            this.util.showToast("Your browser doesn't support blob API");
            console.error(e, xhr);
          } else {
            const blob = xhr['response'];
            let formData: FormData = new FormData(),
              xhr2: XMLHttpRequest = new XMLHttpRequest();
            formData.append('files[]', blob);
            this.uploadingHandler[targetPath] = xhr2;
            xhr2.onreadystatechange = () => {
              if (xhr2.readyState === 4) {
                if (xhr2.status === 200)
                  resolve(JSON.parse(xhr2.response));
              }
            };

            xhr2.upload.onprogress = (event) => {
              this.uploadingProgress[targetPath] = event.loaded * 100 / event.total;
            };
            xhr2.open('POST', this.serverUrl, true);
            xhr2.send(formData);
          }
        };
        xhr.send();
      }
    });
  }

  private util = ((_this: any) => {
    return {
      removeFromArray<T>(array: Array<T>, item: T) {
        let index: number = array.indexOf(item);
        if (index !== -1) {
          array.splice(index, 1);
        }
      },
      trustImages() {
        _this.imagesValue = _this.images.map(
          val => {
            return {
              url: val,
              sanitized: _this.sanitization.bypassSecurityTrustStyle("url(" + val + ")")
            }
          }
        );
      },
      showToast(text: string) {
        _this.toastCtrl.create({
          message: text,
          duration: 5000,
          position: 'top'
        }).present();
      }
    }
  })(this);
}
