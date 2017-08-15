import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Song } from '../models/song';
import { GLOBAL } from './global';

@Injectable()
export class SongService {
  public url: string;

  constructor(private _http: Http, ) {
    this.url = GLOBAL.url;
  }

  getSongs(token, album_id = null) {
    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });
    if (album_id == null) {
      return this._http.get(this.url + 'songs', {headers: headers})
        .map(res => res.json());
    } else {
      return this._http.get(this.url + 'songs/' + album_id, {headers: headers})
        .map(res => res.json());
    }
  }

  getSong(token, id) {

    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.get(this.url + 'song/' + id, {headers: headers})
      .map(res => res.json());
  }

  addSong(token, song: Song) {
    let params =  JSON.stringify(song);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.post(this.url + 'song', params, {headers: headers})
      .map(res => res.json());
  }

  editSong(token, id:string, song: Song) {
    let params =  JSON.stringify(song);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.put(this.url + 'song/' + id, params, {headers: headers})
      .map(res => res.json());
  }

  deleteSong(token, id) {

    const headers = new Headers({
      'Content-type': 'application/json',
      'Authorization': token
    });

    return this._http.delete(this.url + 'song/' + id, {headers: headers})
      .map(res => res.json());
  }
}
