import { Component, OnInit, Input } from '@angular/core';
import { notificationItems } from 'src/app/mocks/notificationItems.mock';
import { UserProfile } from '../../helper';

@Component({
  selector: 'op-spa-notifications-list',
  templateUrl: './spa-notifications-list.component.html',
  styleUrls: ['./spa-notifications-list.component.scss']
})
export class SpaNotificationsListComponent implements OnInit {
  @Input() notificationInformation: any;
  toggleBody = true;
  toggleViewMore = true;

  constructor() { }

  ngOnInit(): void {
    this.notificationInformation = {
      ...this.notificationInformation,
      notificationInfo: notificationItems,
    };
    console.log(notificationItems);
    console.log(this.notificationInformation);
  }

}
