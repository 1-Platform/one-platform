import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../app.service';
import { UserProfile } from '../helper';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'op-manage-notification',
  templateUrl: './manage-notification.component.html',
  styleUrls: ['./manage-notification.component.scss']
})
export class ManageNotificationComponent implements OnInit {
  user = UserProfile;
  applications: any;
  applicationName: string;
  channel: string;
  type: string;
  schedule: any;
  createdBy = this.user.rhatUUID;
  notificationFormData: any;
  toast: boolean;
  repeat: string;
  notificationID: string;
  targets: string[] = [];
  editID: string;

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.params.subscribe(res => {
      if (res?.id) {
        this.editConfig(res.id);
        this.editID = res.id;
      }
    });
  }

  ngOnInit(): void {
    this.appService.getHomeTypeByUser(this.user.rhatUUID)
    .then(result => {
      this.applications = result;
    })
    .catch(err => err);
  }

  onSubmit(value) {
    this.notificationFormData = {
      source: this.applicationName,
      channel: value.channel,
      type: value.trigger,
      createdBy: this.createdBy,
      createdOn: new Date().toUTCString(),
      typeOptions: {
        action: this.repeat,
        startDate: value.time,
      },
      targets: this.targets,
    };
    if (!this.editID) {
      this.appService.createNotificationConfig(this.notificationFormData).subscribe(result => {
        if (result) {
          const pfeToast = window.document.querySelector('pfe-toast');
          (pfeToast as any).open();
        }
      });
    } else {
      this.notificationFormData = {
        ...this.notificationFormData,
        updatedBy: UserProfile.rhatUUID,
        updatedOn: new Date().toUTCString(),
      };
      this.appService.updateNotificationConfig(this.notificationFormData).subscribe(result => {
        if (result) {
          const pfeToast = window.document.querySelector('pfe-toast');
          (pfeToast as any).open();
        }
      });
    }
  }

  addRoverGroup(roverGroup) {
    if (roverGroup !== '') {
      this.targets.push(roverGroup.trim().replace(/ /g, '-'));
    }
  }

  removeTarget(roverGroup) {
    this.targets = this.targets.filter(group => group !== roverGroup);
  }

  editConfig(id) {
    this.appService.getNotificationConfigBy({ id }).then((data: NotificationConfig[]) => {
      this.notificationID = data[0].id;
      this.channel = data[0].channel;
      this.type = data[0].type;
      this.targets = data[0].targets;
      this.createdBy = data[0].createdBy;
      this.applicationName = (data[0].source as any).name;
      return data;
    });
  }
}
