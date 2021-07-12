import { Component, OnInit } from '@angular/core';
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
  createdBy: string;
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
      // If editID is available then the form is in edit state or else it is in create state
      if (res?.id) {
        this.editConfig(res.id);
        this.editID = res.id;
      }
    });
  }

  async ngOnInit() {
    this.applications = await this.appService.getHomeTypeByUser(this.user?.rhatUUID)
    .then(result => result.filter(spa => spa.entityType === 'spa'))
    .catch(err => err);
  }

  /**
   * This is a on Submit handler to create or update notification config
   * @param formData Form data
   */
  onSubmit(formData) {
    this.notificationFormData = {
      source: this.applicationName,
      channel: formData.channel,
      type: formData.trigger,
      typeOptions: {
        action: this.repeat,
        startDate: formData.time,
      },
      targets: this.targets,
    };
    if (!this.editID) {
      this.notificationFormData = {
        ...this.notificationFormData,
        createdBy: this.user?.rhatUUID,
        createdOn: new Date().toUTCString(),
      };
      this.appService.createNotificationConfig(this.notificationFormData).subscribe((result) => {
        if (result) {
          window.OpNotification.success({subject: 'Notification successfully created'});
        }
      },
      (err) => {
        window.OpNotification.danger({subject: 'Error', body: err});
      });
    } else {
      this.notificationFormData = {
        ...this.notificationFormData,
        updatedBy: UserProfile.rhatUUID,
        updatedOn: new Date().toUTCString(),
      };
      this.appService.updateNotificationConfig(this.notificationFormData).subscribe(result => {
        if (result) {
          window.OpNotification.success({subject: 'Notification successfully created'});
        }
      },
      (err) => {
        window.OpNotification.danger({subject: 'Error', body: err});
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
