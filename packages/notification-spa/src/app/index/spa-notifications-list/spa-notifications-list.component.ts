import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'op-spa-notifications-list',
  templateUrl: './spa-notifications-list.component.html',
  styleUrls: ['./spa-notifications-list.component.scss']
})
export class SpaNotificationsListComponent implements OnInit {
  @Input() notificationInformation: any;
  toggleBody = true;
  toggleViewMore = true;
  visibleIndex: number;

  constructor(
    private appService: AppService,
  ) {}

  ngOnInit(): void {
    this.appService.getNotificationConfigBy({ source: this.notificationInformation._id }).then(data => {
      this.notificationInformation = {
        ...this.notificationInformation,
        notificationInfo: data,
      };
    });
  }

  deleteConfig(config) {
    this.appService.deleteNotificationConfig(config?.id).subscribe(data => {
      this.notificationInformation = {
        ...this.notificationInformation,
        notificationInfo: data,
      };
      console.log(this.notificationInformation);
    });
  }

  viewMore(index) {
    if (this.visibleIndex === index) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = index;
    }
  }
}
