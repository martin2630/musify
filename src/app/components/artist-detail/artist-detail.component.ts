import { Component, OnInit } from '@angular/core';

import { Artist } from '../../models/artist';
import { Album } from '../../models/album';
import { ArtistService } from '../../services/artist.service';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Params, Router} from '@angular/router';
import { AlbumService } from '../../services/album.service';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css'],
  providers: [ UserService, ArtistService, AlbumService ]
})
export class ArtistDetailComponent implements OnInit {
  public title: string;
  public artist: Artist;
  public albums: Album[];
  public identity;
  public token;
  public errorMessage;
  public url: string;
  public confirmado;


  constructor(
    private _userSerivices: UserService,
    private _artistSerivices: ArtistService,
    private _albumSerivices: AlbumService,
    private _route: ActivatedRoute,
    private _router:  Router,
  ) {
    this.title = 'Editar Artista';
    this.identity = this._userSerivices.getIdentity();
    this.token = this._userSerivices.getToken();
    this.url = GLOBAL.url;
    this.confirmado = null;
  }

  ngOnInit() {
    this.getArtist();
  }
  getArtist() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._artistSerivices.getArtist(this.token, id).subscribe(
        response => {
          if (!response.artist) {
            // this.errorMessage = body.message;
            this._router.navigate(['/']);
          }else {
            console.log()
            this.artist = response.artist;

            // sacar los albums del artista
            this._albumSerivices.getAlbums(this.token, this.artist._id).subscribe(
              response => {
                if (!response.albums) {
                  this.errorMessage = "Este artista no tiene albums";
                } else {
                  this.albums = response.albums;
                }
              },
              error => {
                let errorMessage = <any>error;

                if (errorMessage != null) {
                  let body = JSON.parse(error._body);
                  // this.errorMessage = body.message;
                }

              }
            );
          }
        },
        error => {
          let errorMessage = <any>error;

          if (errorMessage != null) {
            let body = JSON.parse(error._body);
            // this.errorMessage = body.message;
          }

        }
      );
    });
  }
  onDeleteConfirm(id) {
    this.confirmado = id;
  }

  onCancelAlbum() {
    this.confirmado = null;
  }

  onDeleteAlbum(id) {
    if (this.confirmado == id) {
      this._albumSerivices.deleteAlbum(this.token, id).subscribe(
        response => {
          if (!response.album) {
            alert("No se pudo borrar el artista");
          }
          this.getArtist();

        },
        error => {
          let errorMessage = <any>error;

          if (errorMessage != null) {
            let body = JSON.parse(error._body);
            this.errorMessage = body.message;
          }
        }
      );
    }
  }

}
