import {Component, EventEmitter, Output} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {PostPage} from "../post/post";
import {User} from "../../shared/user";
import {HttpService} from "../../services/http.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HttpService]
})
export class HomePage {

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private httpService: HttpService) {

  }

  users: User[] = [];

  onPostPage() {
    this.navCtrl.push(PostPage);
  }

  ngOnInit(){
    this.httpService.getData().subscribe(
      (resp: any) => {
        var usersList = resp.json().users;
        for(let index in usersList){
          console.log(usersList[index]);
          let user = usersList[index];
          this.users.push({name: user.userName, age: user.userAge});
        }
      }
    );
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      buttons: ['Подписаться', 'Поделиться', 'Пожаловаться']
    });
    alert.present();
  }
}
