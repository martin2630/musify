import {Component, OnInit} from '@angular/core';
import { User } from './models/user';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ UserService ]

})
export class AppComponent implements OnInit {
  public title = 'Musify';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;

  constructor(public _userService: UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', 'null');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', 'null');
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }


  onSubmit() {
    // conseguir los datos del usuario identificado
    this._userService.signUp(this.user).subscribe(
      response => {
        console.log(response);
        let identity = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          alert('el usuario no esta loggueado correctamente');
          console.log('el usuario no esta loggueado correctamente');
        }else {
          // crear una sesion en el localStorage
          localStorage.setItem('identity', JSON.stringify(identity));

          // conseguir el token para enviarselo a cada peticion http
          this._userService.signUp(this.user,'true' ).subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token <= 0){
                alert('el token no se ha generado');
              }else {
                // crear una sesion en tener el token definido
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', 'null');
              }

            },
            error => {
              console.log(error);
              let errorMessage = <any>error;
              if (errorMessage != null) {
                const body = JSON.parse(error._body)
                console.log(body.message);
                this.errorMessage = body.message;
              }

            });

        }

      },
      error => {
        let errorMessage = <any>error;
        if (errorMessage != null) {
          const body = JSON.parse(error._body)
          console.log(body.message);
          this.errorMessage = body.message;
        }

    });
  }

  onSubmitRegister() {
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if (!this.user_register._id) {
          this.alertRegister = 'error al registrarse';
        } else {
          this.alertRegister = 'El registro se ha realizo con éxito. Registrate ' + this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', 'null');
        }

      },
        error =>{
        let alertRegister = <any>error;

        if (alertRegister != null) {
          let body = JSON.parse(error._body);
          this.alertRegister = body.message;
        }

      }
    );
  }

  logOut() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    this.identity = null;
    this.token = null;
  }



}
