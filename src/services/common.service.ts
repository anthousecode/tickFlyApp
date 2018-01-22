import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Headers} from "@angular/http";
import {AuthService} from "./auth.service";

@Injectable()
export class CommonService {

  constructor(private http: Http, private authService: AuthService) {
  }

  setTimezone(timezone) {
    return this.http.put(this.authService.API + `/api/v1/user/update-timezone/` + timezone,
      {},
      {
        headers: new Headers({"Authorization": 'Bearer ' + this.authService.getToken()})
      })
  }
}
