import { Component, OnInit } from '@angular/core';
import { routing, appRoutingProviders_} from '../../app.routing';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Artist } from '../../models/artist';
import {UserService} from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import {ArtistService} from '../../services/artist.service';


@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
  providers: [ UserService, ArtistService]
})
export class ArtistListComponent implements OnInit {
  public title: string;
  public artists: Array<Artist>;
  public identity: string;
  public token: string;
  public url: string;
  public next_page;
  public prev_page;
  public errorMessage;
  public confirmado: string;

  constructor(
    private _userSerivices: UserService,
    private _artistSerivices: ArtistService,
    private _route: ActivatedRoute,
    private _router:  Router
  ) {

    this.title = 'Artistas';
    this.identity = this._userSerivices.getIdentity();
    this.token = this._userSerivices.getToken();
    this.next_page = 1;
    this.prev_page = 1;
    this.url = GLOBAL.url;

  }

  ngOnInit() {
    this.getArtists();
  }


  getArtists() {
    this._route.params.forEach(
      (params: Params) => {
        let page = +params['page'];
        if (!page) {
          page = 1;
        }else {
            this.next_page = page + 1;
            this.prev_page = page - 1;
            if (this.prev_page === 0) {
              this.prev_page = 1;
            }
          this._artistSerivices.getArtists(this.token, page).subscribe(
            response => {
              if (!response.artists){
                this._router.navigate(['/home']);
              }else {
                this.artists = response.artists;
                console.log(this.artists);
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
        }

    });

  }

  onDeleteConfirm(id) {
    this.confirmado = id;
  }

  onCancelArtist() {
    this.confirmado = "";
  }
  onDeleteArtist(id) {
    if (this.confirmado == id) {
      this._artistSerivices.deleteArtist(this.token, id).subscribe(
        response => {
          if (!response.artist) {
            alert("No se pudo borrar el artista");
          }

          this.getArtists();

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
