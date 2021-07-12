import moment from 'moment';
import Twig from 'twig';
import * as _ from 'lodash';
import { NotificationQueue, NotificationsArchive } from './schema';
import { pubsub, nodemailer, validateAndFormatRecipients, findTwigVariables } from './helpers';
import { NotificationConfigModel } from './notificationConfig/schema';
import { NotificationTemplate } from './notificationTemplates/schema';
import { NotificationsBroadcaster } from './broadcaster';

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

/**
 * Processes the notification
 *
 * - Adds it to the queue if scheduled
 * - Forwards it to the appropriate channel if triggered
 */
export function processNotification ( payload: OpNotification, config: NotificationConfigModel) {
  if ( config.type === NotificationType.SCHEDULED ) {
    return enqueue( payload, config );
  }

  if ( config.type === NotificationType.TRIGGERED ) {
    return sendNow( payload, config );
  }
}

/**
 * Processes the notification template
 * and sends the email
 */
export async function processTemplate ( templateID: string, payload: NotificationTemplatePayload ) {
  const template = await NotificationTemplate.findOne( { templateID } ).exec();
  if ( !template ) {
    throw new Error( `No template not found for templateID: ${ templateID }` );
  }
  if ( !template.isEnabled ) {
    throw new Error( 'The selected template is disabled/inactive. Please enable it to use it.' );
  }
  if ( template.templateType !== TemplateType.EMAIL ) {
    throw new Error( `Notification triggers are not supported for ${ template.templateType } yet.` );
  }

  const subjectTemplate = Twig.twig( { data: template.subject } );
  const bodyTemplate = Twig.twig( { data: template.body } );

  /* Preliminary check to verify if payload contains the required variables */
  const templateVariables = new Set( [
    ...Array.from( findTwigVariables( subjectTemplate ) ),
    ...Array.from( findTwigVariables( bodyTemplate ) ),
  ] );
  const missingVars = _.difference( Array.from( templateVariables ), Object.keys( payload.data ) );
  if ( missingVars.length > 0 ) {
    throw new Error( `payload.data is missing some fields: ${ missingVars.join( ', ' ) }` );
  }

  /* Render the templates using payload */
  const subject = subjectTemplate.render( payload.data );
  const body = bodyTemplate.render( payload.data );

  const to = payload.to ? validateAndFormatRecipients( payload.to ) : [];
  const cc = payload.cc ? validateAndFormatRecipients( payload.cc ) : [];
  const bcc = payload.bcc ? validateAndFormatRecipients( payload.bcc ) : [];

  if ( to.length === 0 && cc.length === 0 && bcc.length === 0 ) {
    throw new Error( 'No Valid emails found in to, cc or bcc' );
  }

  const agenda = NotificationsBroadcaster.getInstance().agenda;
  return agenda.now( 'send email notification', {
    to,
    cc,
    bcc,
    subject,
    body
  } );
}

/**
 * Sends the Notification through the correct channel
 *
 * - Sends an email notification if channel = email
 * - Sends a push notification if channel = push/banner
 */
export function sendNow ( payload: OpNotification, config: NotificationConfig ) {
  /* Creating an copy in the archive */
  const notification = new NotificationsArchive( {
    ...payload,
    config: config.id,
    sentOn: Date(),
  } );

  switch ( config.channel ) {
    case NotificationChannel.EMAIL:
      /* Sending the emailNotification */
      return sendEmailNotification( {
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
      return sendPushNotification( {
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
      return Promise.reject( new Error( `[NotificationsEngineError]: Invalid Notification channel provided: "${ config.channel }"` ) );
  }
}

function enqueue ( payload: Partial<OpNotification>, config: NotificationConfigModel ) {
  const startDate = moment( payload.startDate ),
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

export function sendEmailNotification ( { from, to, cc, bcc, subject, body }: EmailNotificationOptions ) {
  /* If email notifications is not enabled, mock an email response */
  if ( !process.env.ENABLE_EMAIL_NOTIFICATIONS ) {
    const messageId = Math.floor( Math.random() + 100 );
    return Promise.resolve( { messageId: `test-email-id-${ messageId }` } );
  }

  return nodemailer
    .sendMail( {
      from: from ? from.toString() : '"One Platform Notifications" <one-platform-notifications@redhat.com>',
      to: to.join( ', ' ),
      cc: cc?.join( ', ' ),
      bcc: bcc?.join( ', ' ),
      subject,
      text: body,
    } );
}

function sendPushNotification ( { targets, ...payload }: PushNotificationOptions ) {
  return Promise.all(
    targets
      .map( target => pubsub.publish( target, { newNotifications: payload } ) )
  );
}
