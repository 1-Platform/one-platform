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
    this.homeType = await this.appService.getHomeTypeByUser(UserDetails.rhatUUID)
    .then((res: HomeType[]) => {
      return res.map((entity: any) => {
        entity.edit = false;
        return entity;
      })
      .filter(entity => entity.entityType === 'spa');
    });
    return;
  }

  removePermission(data, roverGroup) {
    console.log(data, roverGroup);
    this.homeType = this.homeType.map(entity => {
      
      return entity;
    });
  }

  addPermission(data) {
    console.log(data);
  }

  editPermission(data) {
    console.log(data);
  }
}
