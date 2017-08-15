import { Component, OnInit } from '@angular/core';

import { Album } from '../../models/album';
import {GLOBAL} from '../../services/global';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UploadService } from '../../services/upload.service';
import { Artist } from '../../models/artist';
import { AlbumService } from '../../services/album.service';

@Component({
  selector: 'app-album-edit',
  templateUrl: '../album-add/album-add.component.html',
  styleUrls: ['./album-edit.component.css'],
  providers: [UserService, AlbumService, UploadService ]
})
export class AlbumEditComponent implements OnInit {
  public section: string;
  public album: Album;
  public artist: Artist;
  public identity;
  public token;
  public errorMessage;
  public url: string;
  public is_edit: boolean;
  public fileToUpload: Array<File>;

  constructor(
    private _userSerivices: UserService,
    private _albumServices: AlbumService,
    private _uploadServices: UploadService,
    private _route: ActivatedRoute,
    private _router:  Router,
  ) {
    this.section = 'Editar album';
    this.identity = this._userSerivices.getIdentity();
    this.token = this._userSerivices.getToken();
    this.album = new Album('', '', '', '', '');
    this.url = GLOBAL.url;
    this.is_edit =  true;
  }

  ngOnInit() {
    this.getAlbum();
  }
  getAlbum() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumServices.getAlbum(this.token, id).subscribe(
        response => {
          if (!response.album) {
            // this.errorMessage = body.message;
            this._router.navigate(['/']);
          }else {
            this.album = response.album;
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
      this._albumServices.editAlbum(this.token, id, this.album).subscribe(
        response => {
          if (!response.album) {
            this.errorMessage = 'error en el servidor';
          } else {
            this.errorMessage = 'El album se ha actualizado con éxito.';
            // subir la imagen
            if (!this.fileToUpload) {
              // redigir a un lado
              this._router.navigate(['/artista', response.album.artist]);
            } else {
              this._uploadServices.makeFileRequest(this.url + 'upload-image-album/' + id, [], this.fileToUpload, this.token, 'image')
                .then(
                  (result: any) => {
                    this._router.navigate(['/artista', response.album.artist]);
                  },
                  (error) => {
                    console.log(error);
                  }
                )
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
