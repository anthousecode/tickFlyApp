import {Injectable} from '@angular/core';
import 'rxjs/add/operator/filter';
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {AuthService} from "./auth.service";

@Injectable()
export class SearchService {

  constructor(private http: Http, private authService: AuthService) {
  }

  getSearchResult(section: string, searchQuery: string) {
    return this.http.get(this.authService.API + `/api/v1/search?section=` + section + `&q=` + searchQuery,
      {headers: new Headers({"Authorization": 'Bearer ' + this.authService.getToken()})})
  }

}
