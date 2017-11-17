import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Headers} from "@angular/http";
import {AuthService} from "./auth.service";

@Injectable()
export class HttpService{

  posts = [];

  constructor(private http: Http, private authService: AuthService){ }

  getData(){
    return this.http.get('user.json')
  }

  getPosts() {
    return this.http.get(this.authService.API + `/api/v1/post/`,
      {headers: new Headers({"Authorization": 'Bearer ' + this.authService.getToken()})})
  }

  getPost(postId) {
    return this.http.get(this.authService.API + `/api/v1/post/by-id/` + postId,
      {headers: new Headers({"Authorization": 'Bearer ' + this.authService.getToken()})})
  }
}
