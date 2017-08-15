import { Component, OnInit } from '@angular/core';

import { Song } from '../../models/song';
import { SongService } from '../../services/song.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-song-edit',
  templateUrl: '../song-add/song-add.component.html',
  styleUrls: ['./song-edit.component.css'],
  providers: [UserService, SongService, UploadService]
})

export class SongEditComponent implements OnInit {
  public section: string;
  public song: Song;
  public identity;
  public token;
  public errorMessage;
  public url: string;
  public is_edit:boolean;
  public fileToUpload: Array<File>;


  constructor(
    private _userSerivices: UserService,
    private _songSerivices: SongService,
    private _uploadServices: UploadService,
    private _route: ActivatedRoute,
    private _router:  Router,
  ) {
    this.section = 'Editar Canción';
    this.identity = this._userSerivices.getIdentity();
    this.token = this._userSerivices.getToken();
    this.song = new Song('', '', '', '', '', '');
    this.is_edit = true;
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.getSong();
  }
  getSong() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._songSerivices.getSong(this.token, id).subscribe(
        response => {
          if (!response.song) {
            // this.errorMessage = body.message;
            this._router.navigate(['/']);
          }else {
            this.song = response.song;
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
      this._songSerivices.editSong(this.token, id, this.song).subscribe(
        response => {
          if (!response.song) {
            this.errorMessage = 'error al actualizar la cancion';
          } else {

            this.errorMessage = 'La canción se ha actualizado con éxito.';

            // this._router.navigate(['detalle/' + this.artist.name]);
            if (!this.fileToUpload) {
              this._router.navigate(['/album/', response.song.album]);
            } else {
              // subir el fichero de audio
              this._uploadServices.makeFileRequest(this.url + 'upload-file-song/' + id, [], this.fileToUpload, this.token, 'file')
                .then(
                  (result: any) => {
                    this._router.navigate(['/album', response.song.album]);
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
