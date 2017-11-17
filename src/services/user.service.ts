import {Injectable} from "@angular/core";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {Http} from "@angular/http";
import {AuthService} from "./auth.service";
import {Headers} from '@angular/http';

@Injectable()
export class UserService {

  constructor(private http: Http, private authService: AuthService) {

  }

  API = "http://localhost:8080";

  getProfile(idUser) {
    return this.http.get(this.authService.API + `/api/v1/user/profile?id_user=` + idUser,
      {headers: new Headers({"Authorization": 'Bearer ' + this.authService.getToken()})})
  }

  getFollowers(idUser) {
    return this.http.get(this.authService.API + `/api/v1/user/followers?id_user=` + idUser,
      {headers: new Headers({
        "Authorization": 'Bearer ' + this.authService.getToken()
      })})
  }

  getFollowed(idUser) {
    return this.http.get(this.authService.API + `/api/v1/user/followed?id_user=` + idUser,
      {headers: new Headers({
        "Authorization": 'Bearer ' + this.authService.getToken()
      })})
  }

  toggleSubscribe(idUser) {
    return this.http.post(this.authService.API + `/api/v1/user/subscribe-unsubscribe`,
      {id_user: idUser},
      {headers: new Headers({
        "Authorization": 'Bearer ' + this.authService.getToken()
      })})
  }

}
