import {Injectable} from "@angular/core";
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {Http} from "@angular/http";
import {AuthService} from "./auth.service";

@Injectable()
export class UserService {

  constructor(private http: Http, private authService: AuthService) {

  }

  getProfile() {
    return this.http.get(this.authService.API + `/api/v1/user/profile`)
      // {headers: new Headers({"X-Requested-With": "XMLHttpRequest"})})
  }

}
