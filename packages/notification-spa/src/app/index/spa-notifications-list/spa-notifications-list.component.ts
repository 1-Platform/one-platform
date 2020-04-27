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

  constructor() { }

  ngOnInit(): void {
  }

}
