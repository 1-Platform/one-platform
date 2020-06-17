import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-auth-item',
  templateUrl: './user-auth-item.component.html',
  styleUrls: ['./user-auth-item.component.scss']
})
export class UserAuthItemComponent implements OnInit {
  @Input() homeInput: HomeType;
  homeEntity: HomeType;
  edit = false;

  constructor(
    private appService: AppService,
  ) {

  }

  ngOnInit(): void {
    this.homeEntity = _.cloneDeep(this.homeInput);
  }

  removePermission(data: HomeType, roverGroup) {
    this.homeEntity = {
      ...data,
    permissions: data.permissions.filter(permission => permission.roverGroup !== roverGroup),
    };
  }

  cancelEdit() {
    this.homeEntity = _.cloneDeep(this.homeInput);
  }

  addPermission(data: HomeType) {
    const permission: any = data.permissions;
    permission.push({
      role: 'USER',
      roverGroup: '',
    });
    this.homeEntity = {
      ...data,
      permissions: permission,
    };
  }

  saveEdit(data: any) {
    const cleanedInput = {
      _id: data._id,
      permissions: data.permissions.map(permission => {
        delete permission.__typename;
        return permission;
      }),
    };
    this.appService.updateHomeType(cleanedInput).subscribe(response => response);
  }
}
