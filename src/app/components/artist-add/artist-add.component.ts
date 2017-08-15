import { Component, OnInit } from '@angular/core';
import { routing, appRoutingProviders_} from '../../app.routing';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Artist } from '../../models/artist';
import {UserService} from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-artist-add',
  templateUrl: './artist-add.component.html',
  styleUrls: ['./artist-add.component.css'],
  providers: [ UserService, ArtistService ]
})
export class ArtistAddComponent implements OnInit {
  public title: string;
  public artist: Artist;
  public identity: string;
  public token: string;
  public url: string;
  public errorMessage;
  public fileToUpload: Array<File>;

  constructor(
    private _userSerivices: UserService,
    private _artistSerivices: ArtistService,
    private _route: ActivatedRoute,
    private _router:  Router,

  ) {
    this.title = 'Agregar un artista';
    this.identity = this._userSerivices.getIdentity();
    this.token = this._userSerivices.getToken();
    this.artist = new Artist('', '', '', '');
  }

  ngOnInit() {

  }

  onSubmit() {
    this._artistSerivices.addArtist(this.token, this.artist).subscribe(
      response => {
        let artist = response.artist;
        if (!this.artist) {
          this.errorMessage = 'error al registrarse';
        } else {
          this.errorMessage = 'El registro se ha realizo con éxito.';
          this.artist = artist;
          // redirect to detail
          this._router.navigate(['editar-artista/' + response.artist._id]);

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

  fileChangeEvent(fileInput:any){
    this.fileToUpload = <Array<File>>fileInput.target.files;
  }

}
