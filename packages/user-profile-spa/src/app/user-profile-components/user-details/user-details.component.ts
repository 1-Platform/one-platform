import { Component, OnInit } from '@angular/core';
import { UserDetailsMock } from '../../mocks/user-profile-mock';
import { IUserDetails } from 'src/app/user-profile.interface';
import { AppService } from 'src/app/app.service';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  userDetails: IUserDetails;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    // this.userDetails = UserDetailsMock;
    // this.appService.getAllUsers().then(console.log);
    this.appService.addUserFromLDAP('singole').subscribe((res) => {
      console.log(res);
    });
  }
}
