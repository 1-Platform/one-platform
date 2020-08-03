import { NotificationQueue, NotificationsArchive } from './schema';
import { pubsub, nodemailer } from './helpers';
import { NotificationConfigModel } from './notificationConfig/schema';
import moment from 'moment';

enum NotificationChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  BANNER = 'BANNER',
}
enum NotificationType {
  TRIGGERED = 'TRIGGERED',
  SCHEDULED = 'SCHEDULED',
}
enum NotificationStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

class NotificationEngine {
  /**
   * Processes the notification
   *
   * - Adds it to the queue if scheduled
   * - Forwards it to the appropriate channel if triggered
   */
  process ( payload: OpNotification, config: NotificationConfigModel, sendNow?: boolean ) {
    if ( config.type === NotificationType.SCHEDULED ) {
      return this.enqueue( payload, config );
    }

    if ( config.type === NotificationType.TRIGGERED ) {
      return this.sendNow( payload, config );
    }
  }

  /**
   * Sends the Notification throw the correct channel
   *
   * - Sends an email notification if channel = email
   * - Sends a push notification if channel = push/banner
   */
  sendNow ( payload: OpNotification, config: NotificationConfig ) {
    /* Creating an copy in the archive */
    const notification = new NotificationsArchive( {
      ...payload,
      config: config.id,
      sentOn: Date(),
    } );

    switch ( config.channel ) {
      case NotificationChannel.EMAIL:
        /* Sending the emailNotification */
        return this.sendEmailNotification( {
          to: config.targets,
          cc: payload.secondaryTargets,
          subject: payload.subject,
          body: payload.body,
        } )
          .then( () => {
            /* Set the status to succes, and save in the archive */
            notification.status = NotificationStatus.SUCCESS;
            return notification.save();
          } )
          .catch( async err => {
            /* Set the status to failed, and save in the archive */
            notification.status = NotificationStatus.FAILED;
            await notification.save();
            throw err;
          } );
      case NotificationChannel.PUSH:
      case NotificationChannel.BANNER:
        /* Sending the push notification */
        return this.sendPushNotification( {
          targets: config.targets.concat( ...payload.secondaryTargets || [] ),
          subject: payload.subject,
          body: payload.body,
          link: payload.link || config.defaultLink,
          data: payload.data,
          type: config.channel,
          sentOn: notification.sentOn,
        } )
          .then( () => {
            /* Set the status to succes, and save in the archive */
            notification.status = NotificationStatus.SUCCESS;
            return notification.save();
          } )
          .catch( async err => {
            /* Set the status to failed, and save in the archive */
            notification.status = NotificationStatus.FAILED;
            await notification.save();
            throw err;
          } );
      default:
        // TODO: Handle invalid notification channels
        return Promise.reject( new Error( `[NotificationsEngineError]: Invalid Notification channel provided: "${ config.channel }"` ) );
    }
  }

  private enqueue ( payload: Partial<OpNotification>, config: NotificationConfigModel ) {
    const startDate = moment( payload.startDate ),
      endDate = moment( payload.endDate ),
      currentDateWithBuffer = moment().subtract( 30, 'minutes' );

    if ( startDate < currentDateWithBuffer ) {
      throw new Error( 'The notification startDate has already expired.' );
    }

    return new NotificationQueue( {
      ...payload,
      config: config.id
    } )
      .save();
  }

  private sendEmailNotification ( { to, cc, subject, body }: EmailNotificationOptions ) {
    /* If email notifications is not enabled, mock an email response */
    if ( !process.env.ENABLE_EMAIL_NOTIFICATIONS ) {
      const messageId = Math.floor( Math.random() + 100 );
      return Promise.resolve( { messageId: `test-email-id-${ messageId }` } );
    }

    const validEmails = to.filter( email => RegExp( /\S+@\S+/ ).test( email ) );
    const validCCEmails = cc?.filter( email => RegExp( /\S+@\S+/ ).test( email ) );

    if ( validEmails.length === 0 && validCCEmails?.length === 0 ) {
      throw new Error( 'No Valid emails found in to or cc' );
    }

    return nodemailer
      .sendMail( {
        from: '"One Platform Notifications" <one-platform-notifications@redhat.com>',
        to: validEmails.join( ', ' ),
        cc: validCCEmails?.join( ', ' ),
        subject,
        text: body,
      } )
      .then( info => info );
  }

  private sendPushNotification ( { targets, ...payload }: PushNotificationOptions ) {
    return Promise.all(
      targets
        .map( target => pubsub.publish( target, { newNotifications: payload } ) )
    );
  }
}

export default new NotificationEngine();
