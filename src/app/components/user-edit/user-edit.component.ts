import { Component, OnInit } from '@angular/core';

import { User } from '../../models/user';
import { UserService} from '../../services/user.service';
import {GLOBAL} from '../../services/global';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [ UserService ]
})
export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity;
  public token;
  public errorMessage;
  public url: string;
  public devices: Array<string>;
  public item: string;

  constructor(private _userService: UserService, ) {
    this.title = 'Actualizar mis datos';
    this.user = new User('', '', '', '', '', 'ROLE_USER', 'null');

    // localStorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.user = this.identity;
    this.url = GLOBAL.url;
  }

  ngOnInit() {
  }

  onSubmit() {
    this._userService.updateUser(this.user).subscribe(
      response => {
        if (!response.user) {
          this.errorMessage = 'El usuario no se ha actualizado';
        }else {
          // this.user = response.user;

          localStorage.setItem('identity', JSON.stringify(this.user));
          document.getElementById('identity_name').innerHTML = this.user.name;

          if (!this.fileToUpload) {
            //redirect
          }else {
            this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.fileToUpload).then(
              (result: any) => {
                this.user.image = result.image;
                localStorage.setItem('identity', JSON.stringify(this.user));
                let image_path = this.url + 'get-image-user/' + this.user.image;
                document.getElementById('image-logged').setAttribute('src', image_path);

              }
            );
          }
          this.errorMessage = 'Los datos se han actualizado correctamente';
        }
      },
      error => {
        let errorMessage = <any>error;
        if (errorMessage != null) {
          let body = JSON.parse(error._body);
          console.log(body.message);
          this.errorMessage = body.message;
        }
      }
    )
  }
  public fileToUpload: Array<File>;

  fileChangeEvent(fileInput:any) {
    this.fileToUpload = <Array<File>>fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    let token = this.token;

    return new Promise(function(resolve, reject) {
      let formData: any = new FormData();
      let xhr = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name);
      }

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.response));
            }else {
              reject(xhr.response);
            }
        }
      }
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData);



    });
  }


}
