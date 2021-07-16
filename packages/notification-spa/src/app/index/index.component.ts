import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { UserProfile } from '../helper';
@Component({
  selector: 'op-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  notificationItems: any;
  toggleModal = false;
  modalSelect: string;
  user = UserProfile;

  constructor(
    private appService: AppService,
  ) { }

  async ngOnInit() {
    this.notificationItems = await this.appService.getHomeTypeByUser(this.user?.rhatUUID)
    .then(result => result.filter(spa => spa.entityType === 'spa'))
    .catch(err => err);
  }
}
