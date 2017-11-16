import { Component } from '@angular/core';
import {PostPage} from "../../pages/post/post";
import {NavController} from "ionic-angular";

/**
 * Generated class for the PostPreviewComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'post-preview',
  templateUrl: 'post-preview.html'
})
export class PostPreviewComponent {

  text: string;

  constructor(public navCtrl: NavController) {
    console.log('Hello PostPreviewComponent Component');
    this.text = 'Hello World';
  }

  onPostPage() {
    this.navCtrl.push(PostPage);
  }

}
