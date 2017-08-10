import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { GLOBAL } from './global';


@Injectable()
export class UserService {
  public url: string;
  public identity: string;
  public token: string;

  constructor(private _http: Http, ) {
    this.url = GLOBAL.url;
  }

  public signUp(user_to_login, gethash = null) {
    if (gethash != null) {
      user_to_login.gethash = gethash;
    }
    let json = JSON.stringify(user_to_login);
    let params = json;

    const headers = new Headers({'Content-type': 'application/json'});
    return this._http.post(this.url + 'login', params, {headers: headers})
      .map(res => res.json());
  }

  public register(user_to_register) {
    let params = JSON.stringify(user_to_register);

    const headers = new Headers({'Content-type': 'application/json'});
    return this._http.post(this.url + 'register', params, {headers: headers})
      .map(res => res.json());
  }

  public updateUser(user_to_update){
    let params = JSON.stringify(user_to_update);

    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.put(this.url + 'update-user/' + user_to_update._id, params, {headers: headers})
      .map(res => res.json());
  }


  public getIdentity() {
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity != 'undefined' ) {
      this.identity = identity;
    }else {
      this.identity = null;
    }

    return this.identity;

  }

  getToken() {
    let token = localStorage.getItem('token');
    if (token != 'undefined') {
      this.token = token;
    }else {
      this.token = null;
    }
    return this.token;
  }

  logOut() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    this.identity = null;
    this.token = null;
  }

}
