import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/song';
import {GLOBAL} from '../../services/global';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  public song: Song;
  public url:  string;
  public play_image_album: boolean;


  constructor() {
    this.url = GLOBAL.url;
    this.play_image_album = true;
  }

  ngOnInit() {
    let song = JSON.parse(localStorage.getItem('sound_song'));
    if (song) {
      this.song = song;
    } else {
      this.song = new Song('', '', '', '', '', '');
    }
  }

}
