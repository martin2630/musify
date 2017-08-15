import { Component, OnInit } from '@angular/core';

import { Artist } from '../../models/artist';
import { ArtistService } from '../../services/artist.service';
import { UploadService } from '../../services/upload.service';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-artist-edit',
  templateUrl: '../artist-add/artist-add.component.html',
  styleUrls: ['./artist-edit.component.css'],
  providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit {
  public title: string;
  public artist: Artist;
  public identity;
  public token;
  public errorMessage;
  public url: string;
  public is_edit:boolean;
  public fileToUpload: Array<File>;


  constructor(
    private _userSerivices: UserService,
    private _artistSerivices: ArtistService,
    private _uploadServices: UploadService,
    private _route: ActivatedRoute,
    private _router:  Router,
  ) {
    this.title = 'Editar Artista';
    this.identity = this._userSerivices.getIdentity();
    this.token = this._userSerivices.getToken();
    this.artist = new Artist('', '', '', '');
    this.is_edit = true;
    this.url = GLOBAL.url;
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
            this.artist = response.artist;
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

  onSubmit() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._artistSerivices.editArtist(this.token, id, this.artist).subscribe(
        response => {
          if (!response.artist) {
            this.errorMessage = 'error al actualizar el album';
          } else {
            this.errorMessage = 'El artista se ha actualizado con éxito.';
            // this._router.navigate(['detalle/' + this.artist.name]);
            if (!this.fileToUpload) {
              this._router.navigate(['/artista', response.artist._id]);
            } else {
              this._uploadServices.makeFileRequest(this.url + 'upload-image-artist/' + id, [], this.fileToUpload, this.token, 'image')
                .then(
                  (result: any) => {
                    this._router.navigate(['/artista', response.artist._id]);
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            }
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

  public fileChangeEvent(fileInput: any) {
    this.fileToUpload = <Array<File>>fileInput.target.files;
  }

}
