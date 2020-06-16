import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-auth-item',
  templateUrl: './user-auth-item.component.html',
  styleUrls: ['./user-auth-item.component.scss']
})
export class UserAuthItemComponent implements OnInit {
  @Input() homeInput: HomeType;
  homeEntity: HomeType;
  edit = false;

  constructor() {

  }

  ngOnInit(): void {
    this.homeEntity = {
      ...this.homeInput
    };
  }

  removePermission(data: HomeType, roverGroup) {
    this.homeEntity = {
      ...data,
    permissions: data.permissions.filter(permission => permission.roverGroup !== roverGroup),
    };
  }

  cancelEdit() {
    this.homeEntity = {
      ...this.homeInput
    }
  }

  addPermission(data) {
    console.log(data);
  }

  saveEdit(data) {
    console.log(data);
  }
}
