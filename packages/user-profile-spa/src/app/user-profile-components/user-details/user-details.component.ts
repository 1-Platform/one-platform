import { Component, OnInit } from '@angular/core';
import { UserDetails } from '../../helper';
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

  async ngOnInit()
  {
    this.userDetails = await this.appService
    .getUsersBy(UserDetails.rhatUUID).then(data => data)
    .catch(err => err);
  }
}
