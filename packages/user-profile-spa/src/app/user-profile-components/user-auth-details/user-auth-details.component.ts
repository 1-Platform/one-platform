import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { UserDetails } from '../../helper';

@Component({
  selector: 'app-user-auth-details',
  templateUrl: './user-auth-details.component.html',
  styleUrls: ['./user-auth-details.component.scss'],
})
export class UserAuthDetailsComponent implements OnInit {
  homeType: any[];
  constructor(
    private appService: AppService
  ) {}

  async ngOnInit() {
    this.homeType = await this.appService
    .getHomeTypeByUser(UserDetails.rhatUUID)
    .then((res: HomeType[]) => {
      return res.filter(entity => entity.entityType === 'spa');
    })
    .catch(err => err);
  }
}
