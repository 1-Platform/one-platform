import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../helper';
import { notificationItemsMock } from '../mocks/notificationItems.mock';
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

  ngOnInit(): void {
    this.appService.getNotificationItems(this.user.rhatUUID).then(data => {
      this.notificationItems = notificationItemsMock;
    });
  }

  sendManualNotification(values) {
    this.appService.sendManualNotification(values).subscribe(result => result);
  }
}
