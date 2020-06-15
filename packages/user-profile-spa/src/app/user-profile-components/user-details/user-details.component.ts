import { Component, OnInit } from '@angular/core';
import { UserDetailsMock } from '../../mocks/user-profile-mock';
import { AppService } from 'src/app/app.service';
@Component( {
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: [ './user-details.component.scss' ],
} )
export class UserDetailsComponent implements OnInit
{
  userDetails: any;
  showDetails = true;

  constructor( private appService: AppService ) { }

  ngOnInit(): void
  {
    this.userDetails = UserDetailsMock;
  }
}
