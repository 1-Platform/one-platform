import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { UserDetailsMock } from '../../helper';

@Component({
  selector: 'app-user-auth-details',
  templateUrl: './user-auth-details.component.html',
  styleUrls: ['./user-auth-details.component.scss'],
})
export class UserAuthDetailsComponent implements OnInit {
  homeType: any[];
  showModal = false;
  constructor(
    private appService: AppService
  ) {}

  async ngOnInit() {
    this.homeType = await this.appService.getHomeTypeByUser(UserDetailsMock.rhatUUID)
    .then((data: HomeType[]) => {
      return data.filter(entity => entity.entityType === 'spa');
    });
    return;
  }

  toggleModal(state) {
    this.showModal = state;
  }
}
