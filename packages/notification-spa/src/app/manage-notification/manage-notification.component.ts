import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { UserProfile } from '../helper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'op-manage-notification',
  templateUrl: './manage-notification.component.html',
  styleUrls: ['./manage-notification.component.scss']
})
export class ManageNotificationComponent implements OnInit {
  user = UserProfile;
  days: Day[] = [
    {
      day: 'mon',
      status: false,
    },
    {
      day: 'tue',
      status: false,
    },
    {
      day: 'wed',
      status: false,
    },
    {
      day: 'thurs',
      status: false,
    },
    {
      day: 'fri',
      status: false,
    },
    {
      day: 'sat',
      status: false,
    },
    {
      day: 'sun',
      status: false,
    },
  ];

  events: EventType[] = [
    {
      name: 'create',
      status: false,
    },
    {
      name: 'update',
      status: false,
    },
    {
      name: 'delete',
      status: false,
    },
  ];

  applications = [
    {
      name: 'Outage Management',
    },
    {
      name: 'TS Catalog',
    },
    {
      name: 'Outage Management',
    },
  ];
  channel: string;
  type: string;
  template: string;
  schedule: Schedule;
  createdBy: string;
  notificationFormData: NotificationSchema;
  modalState: boolean;
  toast: boolean;
  state: boolean;
  repeat: string;
  id: string;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(res => {
      if (res.id) {
        this.id = res.id;
      }
    });
  }

  ngOnInit(): void { }

  onSubmit(value) {
    let option;
    switch (value.trigger) {
      case 'scheduled':
        this.schedule = {
          startDate: value.time,
          repeats: this.days,
        };
        option = this.schedule;
        break;
      case 'triggered':
        option = this.events;
        break;
      default:
        option = null;
    }
    console.log(this.template);
    this.notificationFormData = {
      template: this.template,
      channel: value.channel,
      type: value.trigger,
      typeOption: option,
      createdBy: this.createdBy,
      createdOn: new Date().toUTCString(),
      modifiedBy: null,
      modifiedOn: null
    };
    this.appService.sendNotificationFormData(this.notificationFormData).subscribe(result => {
      if (result) {
        const pfeToast = window.document.querySelector('pfe-toast');
        (pfeToast as any).open();
      }
    });

  }
  toggleModal() {
    this.modalState = !this.modalState;
  }
}
