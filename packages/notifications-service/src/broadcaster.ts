import Agenda from 'agenda';
import moment from 'moment';
import { NotificationQueue } from './schema';
import * as RuleEngine from './engine';
import { Db } from 'mongodb';

export class NotificationsBroadcaster {
  private static instance: NotificationsBroadcaster;
  private repeatInterval = 2;
  agenda: Agenda;

  private constructor ( db: Db ) {
    this.agenda = new Agenda( { mongo: db, defaultConcurrency: 1 } );
    this.agenda.define( 'send notifications', this.sendNotifications );

    this.agenda.define( 'send email notification', (job: any) => {
      const data: any = job.attrs.data;
      return RuleEngine.sendEmailNotification( data );
    } );
  }

  public static getInstance (db?: Db) {
    if ( !this.instance ) {
      if ( !db ) {
        throw new Error( 'Cannot initialize NotificationsBroadcaster without db' );
      }
      this.instance = new NotificationsBroadcaster( db );
    }
    return this.instance;
  }

  /**
   * Start the Notification broadcasting service
   */
  async start () {
    try {
      console.log( '[NotificationBroadcaster]: initializing...' );
      await this.agenda.start();
      await this.agenda.every( `${ this.repeatInterval } minutes`, 'send notifications' );
    } catch ( err ) {
      console.log( '[NotificationBroadcasterError]:', err );
    }
  }

  /**
   * Start Notification broadcaster service
   */
  private async sendNotifications () {
    console.log( `[NotificationBroadcaster]: Running notifications broadcaster: (${ new Date().toISOString() })` );

    const maxTime = moment().subtract( this.repeatInterval, 'minutes' );
    const notifications = await NotificationQueue
      .find( { startDate: { $lte: maxTime.toDate() } } )
      .sort( { startDate: 1 } )
      .populate( 'config' )
      .exec();

    if ( !notifications || notifications.length === 0 ) {
      console.log( '[NotificationBroadcaster]: No notifications scheduled for the moment.' );
      return;
    }

    return Promise.all( notifications.map( notification => {
      return RuleEngine
        .sendNow( notification.toJSON(), <NotificationConfig>notification.config )
        .then( () => {
          console.log( '[NotificationBroadcaster]: Notification sent.' );
          /* Remove the notification from the queue */
          return notification.remove();
        } )
        .catch( err => {
          console.log( 'NotificationBroadcasterError]:', err );
          throw err;
        } );
    } ) );
  }
}
