import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { notificationItemsMock } from './mocks/notificationItems.mock';
import { UserProfile } from './helper';

@Component({
  selector: 'op-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  notificationItems: any;

  constructor(
    private appService: AppService,
  ) {}

  async ngOnInit() {
    this.notificationItems = await this.appService.getHomeTypeByUser(UserProfile.rhatUUID)
    .then(result => notificationItemsMock)
    .catch(err => err);
  }
}
