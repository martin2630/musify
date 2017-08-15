import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// importar los componenetes del usuario
import { UserEditComponent } from './components/user-edit/user-edit.component';
// importar los componenetes del artist
import { ArtistListComponent } from './components/artist-list/artist-list.component';
import { ArtistAddComponent } from './components/artist-add/artist-add.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';
import { AlbumAddComponent } from './components/album-add/album-add.component';
import { AlbumEditComponent } from './components/album-edit/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail/album-detail.component';
import { SongAddComponent } from './components/song-add/song-add.component';
import {SongEditComponent} from './components/song-edit/song-edit.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'mis-datos', component: UserEditComponent },
  {path: 'artistas/:page', component: ArtistListComponent },
  {path: 'editar-artista/:id', component: ArtistEditComponent },
  {path: 'artista/:id', component: ArtistDetailComponent },
  {path: 'crear-album/:artist', component: AlbumAddComponent },
  {path: 'editar-album/:id', component: AlbumEditComponent },
  {path: 'album/:id', component: AlbumDetailComponent },
  {path: 'crear-artista', component: ArtistAddComponent },
  {path: 'crear-cancion/:album', component: SongAddComponent },
  {path: 'editar-tema/:id', component: SongEditComponent },
  {path: '**', component: HomeComponent },

]


export const appRoutingProviders_: any[]=[];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
