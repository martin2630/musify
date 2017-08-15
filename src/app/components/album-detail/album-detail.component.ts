import { Component, OnInit } from '@angular/core';

import { Album } from '../../models/album';
import { Song } from '../../models/song';
import { AlbumService } from '../../services/album.service';
import { GLOBAL } from '../../services/global';
import { UserService } from '../../services/user.service';
import { SongService } from '../../services/song.service';
import { ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css'],
  providers: [ UserService, AlbumService, SongService ]
})
export class AlbumDetailComponent implements OnInit {
  public title: string;
  public album: Album;
  public songs: Song[];
  public identity;
  public token;
  public errorMessage;
  public url: string;
  public confirmado: string;

  constructor(
    private _userSerivices: UserService,
    private _albumSerivices: AlbumService,
    private _songSerivices: SongService,
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
    this.getAlbum();
  }

  getAlbum() {
    this._route.params.forEach((params: Params) => {
      let id = params['id'];
      this._albumSerivices.getAlbum(this.token, id).subscribe(
        response => {
          if (!response.album) {
            // this.errorMessage = body.message;
            this._router.navigate(['/']);
          }else {
            this.album = response.album;

            // sacar las canciones del album
            this._songSerivices.getSongs(this.token, response.album._id).subscribe(
              response => {
                if (!response.songs) {
                  this.errorMessage = "Este album no tiene canciones";
                } else {
                  this.songs = response.songs;
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

  onCancelSong() {
    this.confirmado = null;
  }

  onDeleteSong(id) {
    if (this.confirmado == id) {
      this._songSerivices.deleteSong(this.token, id).subscribe(
        response => {
          if (!response.song) {
            alert('No se pudo borrar la canción');
          }
          this.getAlbum();

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

  startPlayer(song) {
    console.log(song);
    let song_player = JSON.stringify(song);
    let file_path = this.url + 'get-file-song/' + song.file;
    let image_path = this.url + 'get-image-album/' + song.album.image;
    console.log(image_path);

    localStorage.setItem('sound_song', song_player);
    document.getElementById('mp3-source').setAttribute('src', file_path);
    (document.getElementById('player') as any).load();
    (document.getElementById('player') as any).play();
    document.getElementById('play-song-title').innerHTML = song.name;
    document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
    document.getElementById('play-image-album').setAttribute('src', this.url + 'get-image-album/' + song.album.image);

  }

}
