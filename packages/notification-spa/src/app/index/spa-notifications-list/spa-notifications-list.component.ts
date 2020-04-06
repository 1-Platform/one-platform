import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'op-spa-notifications-list',
  templateUrl: './spa-notifications-list.component.html',
  styleUrls: ['./spa-notifications-list.component.scss']
})
export class SpaNotificationsListComponent implements OnInit {
  @Input() notificationInformation: any;
  toggleBody = true;
  toggleViewMore = true;
  dummyData = [
    {
      id: 'U9YSDVCQIZ',
      channelType: 'Pop Up',
      triggerType: 'Scheduled',
      targetNames: ['npatil-all', 'singole'],
      viewMore: true,
    },
    {
      id: 'U9YSDVCQIZ',
      channelType: 'Pop Up',
      triggerType: 'Scheduled',
      targetNames: ['npatil-all', 'singole'],
      viewMore: true,
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
