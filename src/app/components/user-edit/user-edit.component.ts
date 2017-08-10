import { Component, OnInit } from '@angular/core';

import { User } from '../../models/user';
import { UserService} from '../../services/user.service';


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
  constructor(private _userService: UserService, ) {
    this.title = 'Actualizar mis datos';
  }

  ngOnInit() {
  }

}
