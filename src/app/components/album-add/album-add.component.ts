import { Component, OnInit } from '@angular/core';

import { Album } from '../../models/album';
import {GLOBAL} from '../../services/global';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../models/artist';
import { AlbumService } from '../../services/album.service';

@Component({
  selector: 'app-album-add',
  templateUrl: './album-add.component.html',
  styleUrls: ['./album-add.component.css'],
  providers: [UserService, ArtistService, AlbumService]
})
export class AlbumAddComponent implements OnInit {
  public section : string;
  public album: Album;
  public artist: Artist;
  public identity;
  public token;
  public errorMessage;
  public url: string;
  public is_edit;

  constructor(
    private _userSerivices: UserService,
    private _artistSerivices: ArtistService,
    private _albumSerivices: AlbumService,
    private _route: ActivatedRoute,
    private _router:  Router,
  ) {
    this.section = 'Crear album';
    this.identity = this._userSerivices.getIdentity();
    this.token = this._userSerivices.getToken();
    this.album = new Album('', '', '', '', '');
    this.url = GLOBAL.url;
    this.is_edit = true;
  }

  ngOnInit() {

  }
  onSubmit() {
    this._route.params.forEach((params: Params) => {
      let artist_id = params['artist'];
      this.album.artist = artist_id;
      this._albumSerivices.addAlbum(this.token, this.album).subscribe(
        response => {
          if (!response.album) {
            this.errorMessage = "error en el servidor";
          } else {
            this.errorMessage  = "¡El album se ha creado correctamente!";
            this.album = response.album;
            this._router.navigate(['/editar-album/' + response.album._id]);
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
