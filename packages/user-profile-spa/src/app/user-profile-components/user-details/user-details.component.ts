import { Component, OnInit } from '@angular/core';
import { UserDetailsMock, IUserDetails } from '../../mocks/user-profile-mock';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  userDetails: IUserDetails;

  constructor() {}

  ngOnInit(): void {
    this.userDetails = UserDetailsMock;
  }
}
