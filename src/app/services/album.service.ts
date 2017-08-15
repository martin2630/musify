import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Album } from '../models/album';
import { GLOBAL } from './global';

@Injectable()
export class AlbumService {
  public url: string;

  constructor(private _http: Http, ) {
    this.url = GLOBAL.url;
  }

  getAlbums(token, artist_id = null) {
    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });
    if (artist_id == null) {
      return this._http.get(this.url + 'albums', {headers: headers})
        .map(res => res.json());
    } else {
      return this._http.get(this.url + 'albums/' + artist_id, {headers: headers})
        .map(res => res.json());
    }
  }

  getAlbum(token, id) {

    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.get(this.url + 'album/' + id, {headers: headers})
      .map(res => res.json());
  }

  addAlbum(token, album: Album) {
    let params =  JSON.stringify(album);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.post(this.url + 'album', params, {headers: headers})
      .map(res => res.json());
  }

  editAlbum(token, id:string, album: Album) {
    let params =  JSON.stringify(album);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.put(this.url + 'album/' + id, params, {headers: headers})
      .map(res => res.json());
  }

  deleteAlbum(token, id) {

    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.delete(this.url + 'album/' + id, {headers: headers})
      .map(res => res.json());
  }
}
