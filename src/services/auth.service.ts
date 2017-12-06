import { Injectable } from '@angular/core';
import 'rxjs/add/operator/filter';
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {ToastController} from "ionic-angular";

@Injectable()
export class AuthService {

  // auth0 = new auth0.WebAuth({
  //   clientID: 'vFEhteNfA7RsmLqu6d1MOv5yK66njgg6',
  //   domain: 'app-dev.eu.auth0.com',
  //   responseType: 'token id_token',
  //   audience: 'https:/API = "http://localhost:8080";/app-dev.eu.auth0.com/userinfo',
  //   redirectUri: 'http://localhost:8080/callback',
  //   scope: 'openid'
  // });

  API = "http://localhost:8080";

  constructor(private http: Http, private toastCtrl: ToastController) {}

  signin(email: string, password: string) {
    return this.http.post(this.API + `/api/sign-up`,
      {email: email, password: password},
      {headers: new Headers({"X-Requested-With": "XMLHttpRequest"})})
      .map(
        (response: Response) => {
          const token = response.json().access_token;
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace("-", "+").replace("_", "/");
          console.log(JSON.parse(window.atob(base64)));
          return {
            token: token,
            decoded: JSON.parse(window.atob(base64))
          };
        }
      )
      .do(
        tokenData => {
          localStorage.setItem("token", tokenData.token);
        }
      );
  }

  signup(nickname: string, email: string, password: string) {
    return this.http.post(this.API + `/api/sign-up`,
      {nickname: nickname, email: email, password: password},
      {headers: new Headers({"X-Requested-With": "XMLHttpRequest"})})
      .map(
        (response: Response) => {
          const token = response.json().access_token;
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace("-", "+").replace("_", "/");
          console.log(JSON.parse(window.atob(base64)));
          return {
            token: token,
            decoded: JSON.parse(window.atob(base64))
          };
        }
      )
      .do(
        tokenData => {
          localStorage.setItem("token", tokenData.token);
        }
      );
  }

  getCurrentUserId() {
    return this.http.get( this.API + `/api/user-info`,
      {headers: new Headers({'Authorization': 'Bearer ' + this.getToken()})})
      .subscribe(
        response => {
          console.log(response.json().user.id_user);
          const idUser = response.json().user.id_user;
          console.log(response.json().user.id_user);
          localStorage.setItem("id_user", idUser);
        }
      )
  }

  signinGoogle() {
    console.log('Google auth test');
    let htmlAlert;
    return this.http.get(this.API + '/api/google/authorize')
  }


  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("id_user");
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUserId() {
    return localStorage.getItem("id_user");
  }

  isLogin(): boolean {
    if (this.getToken()) {
      return true;
    }
  }

  presentSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Вы были успешно авторизированы!',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  presentUnsuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Авторизация не выполнена!',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // signupFacebook(email: string, password: string) {
  //   return this.http.post(`${this.API}\api\facebook\authorize`)
  //     .subscribe();
  // }

  // signin(email: string, password: string) {
  //   return this.http.post( `${this.API}\api\signin',
  //     {email: email, password: password})
  //     .subscribe();
  // }

}
