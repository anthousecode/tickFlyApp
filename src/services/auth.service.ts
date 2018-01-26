import {Injectable} from '@angular/core';
import 'rxjs/add/operator/filter';
import {Http, Headers, Response} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {ToastController} from "ionic-angular";
import {GooglePlus} from "@ionic-native/google-plus";

@Injectable()
export class AuthService {
  // API = "http://localhost:8080";
  API = "http://ec2-54-186-176-148.us-west-2.compute.amazonaws.com:8080/";

  constructor(private http: Http) {
  }

  getHeaders(type) {
    switch (type) {
      case "auth":
        return {headers: new Headers({"Authorization": 'Bearer ' + this.getToken()})};
      case "xml":
        return {headers: new Headers({"X-Requested-With": "XMLHttpRequest"})};
      default:
        return "";
    }
  }

  signin(email: string, password: string) {
    return this.http.post(this.API + `/api/sign-up`,
      {email: email, password: password},
      {headers: new Headers({"X-Requested-With": "XMLHttpRequest"})})
      .map(
        (response: Response) => {
          const token = response.json().access_token;
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace("-", "+").replace("_", "/");
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
    return this.http.get(this.API + `/api/v1/user/user-info`,
      {headers: new Headers({'Authorization': 'Bearer ' + this.getToken()})})
      .subscribe(
        response => {
          const idUser = response.json().user.id_user;
          localStorage.setItem("id_user", idUser);
        }
      )
  }

  signinGoogle(email: string, userId: number, displayName: string, familyName: string, givenName: string) {
    return this.http.get(this.API + '/api/sign-up-google?email=' + email + '&userId=' + userId +
      '&displayName=' + displayName + '&familyName=' + familyName + '&givenName=' + givenName,
      {})
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

  signinFacebook(facebookToken: string) {
    return this.http.get(this.API + '/api/sign-up-facebook?access_token=' + facebookToken)
  }

}
