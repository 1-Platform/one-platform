import { Component, OnInit } from '@angular/core';
import {
  UserAppAuthDetailsMock,
  IUserAppAuthDetails,
} from '../../mocks/user-profile-mock';

@Component({
  selector: 'app-user-auth-details',
  templateUrl: './user-auth-details.component.html',
  styleUrls: ['./user-auth-details.component.scss'],
})
export class UserAuthDetailsComponent implements OnInit {
  userAppAuthDetails: IUserAppAuthDetails[];

  showModal = false;

  constructor() {}

  ngOnInit(): void {
    this.userAppAuthDetails = UserAppAuthDetailsMock;
  }

  toggleModal(state) {
    this.showModal = state;
  }
}
