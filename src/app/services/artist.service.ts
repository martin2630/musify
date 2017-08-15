import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import {Artist} from '../models/artist';
import { GLOBAL } from './global';


@Injectable()
export class ArtistService {
  public url: string;

  constructor(private _http: Http, ) {
    this.url = GLOBAL.url;
  }

  getArtists(token, page) {

    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.get(this.url + 'artists/' + page, {headers: headers})
      .map(res => res.json());
  }

  getArtist(token, id) {

    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.get(this.url + 'artist/' + id, {headers: headers})
      .map(res => res.json());
  }

  addArtist(token, artist: Artist) {
    let params =  JSON.stringify(artist);
    let headers = new Headers({
      'Content-Type':'application/json',
      'Authorization': token
    });
    return this._http.post(this.url + 'artist', params, {headers: headers})
      .map(res => res.json());
  }
  editArtist(token, id:string, artist: Artist) {
    let params =  JSON.stringify(artist);
    let headers = new Headers({
      'Content-Type':'application/json',
      'Authorization': token
    });
    return this._http.put(this.url + 'artist/' + id, params, {headers: headers})
      .map(res => res.json());
  }

  deleteArtist(token, id){

    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.delete(this.url + 'artist/' + id, {headers: headers})
      .map(res => res.json());
  }

}
