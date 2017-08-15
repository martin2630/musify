import { Component, OnInit } from '@angular/core';

import { Song } from '../../models/song';
import {GLOBAL} from '../../services/global';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { Album } from '../../models/album';
import { AlbumService } from '../../services/album.service';
import { SongService } from '../../services/song.service';

@Component({
  selector: 'app-song-add',
  templateUrl: './song-add.component.html',
  styleUrls: ['./song-add.component.css'],
  providers: [UserService, AlbumService, SongService]
})
export class SongAddComponent implements OnInit {
  public section: string;
  public song: Song;
  public album: Album;
  public identity;
  public token;
  public errorMessage;
  public url: string;
  public is_edit;

  constructor(
    private _userSerivices: UserService,
    private _songSerivices: SongService,
    private _route: ActivatedRoute,
    private _router:  Router,
  ) {
    this.section = 'Crear Nueva Canción';
    this.identity = this._userSerivices.getIdentity();
    this.token = this._userSerivices.getToken();
    this.song = new Song('', '', '', '', '', '');
    this.url = GLOBAL.url;
    this.is_edit = false;
  }

  ngOnInit() {

  }
  onSubmit() {

    this._route.params.forEach((params: Params) => {
      let album_id = params['album'];
      this.song.album = album_id;
      console.log(this.song);
      this._songSerivices.addSong(this.token, this.song).subscribe(
        response => {
          if (!response.song) {
            this.errorMessage = "error en el servidor";
          } else {
            this.errorMessage  = "¡La cancion se ha creado correctamente!";
            this.song = response.song;
            this._router.navigate(['/editar-tema/' + response.song._id]);
          }
        },
        error => {
          let errorMessage = <any>error;

          if (errorMessage != null) {
            let body = JSON.parse(error._body);
            this.errorMessage = body.message;
          }
        }
      );

    });
  }

}
