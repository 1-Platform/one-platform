import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { UserDetails } from './helper';

@Component( {
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
} )

export class AppComponent implements OnInit{
  userDetails: UserType;

  constructor(
    private appService: AppService
  ) {}
  async ngOnInit() {
    // await this.appService.getHomeTypeByUser(UserDetailsMock.rhatUUID)
    // .then((data: HomeType[]) => {
    //   console.log(data);
    //   this.userDetails = (data[0].owners as any).find(owner => owner.rhatUUID === UserDetailsMock.rhatUUID);
    //   console.log(this.userDetails);
    //   return data.filter(entity => entity.entityType === 'spa');
    // })
    // .catch(err => err);
  }
}
