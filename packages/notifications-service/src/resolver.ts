import { NotificationQueue, NotificationsArchive } from './schema';
import { NotificationConfig } from './notificationConfig/schema';
import * as RuleEngine from './engine';
import { pubsub } from './helpers';

export const NotificationsResolver = {
  Query: {
    listActiveNotifications ( root: any, { limit = 25 }: GraphQLArgs, ctx: any ) {
      return NotificationQueue.find().limit( limit ).exec();
    },
    listArchivedNotifications ( root: any, { targets, limit = 25 }: GraphQLArgs, ctx: any ) {
      return NotificationsArchive.find()
        .populate( 'config' )
        .then( notifications => {
          return notifications
            .filter( notification => {
              /* Finding the notifications with the provided targets */
              return ( ( notification.config as NotificationConfig )?.targets.some( target => targets.includes( target ) ) )
                || ( notification.secondaryTargets?.some( target => targets.includes( target ) ) );
            } )
            .slice( 0, limit );
        } )
        .catch( err => {
          throw err;
        } );
    },
    getNotificationsBy ( root: any, { selector }: GraphQLArgs, ctx: any ) {
      return NotificationQueue.find( selector ).exec();
    }
  },
  Notification: {
    config ( parent: OpNotification, args: any, ctx: any, info: any ) {
      return NotificationConfig.findById( parent.config ).exec();
    },
  },
  Mutation: {
    async newNotification ( root: any, { configID, payload }: GraphQLArgs, ctx: any ) {
      const config = await NotificationConfig.findOne( { configID } ).exec().catch( err => { throw err; } );
      if ( !config ) {
        throw new Error( 'Notification Config not found' );
      }

      return RuleEngine.processNotification( payload, config );
    },
    triggerNotification ( root: any, { templateID, payload }: GraphQLArgs ) {
      return RuleEngine.processTemplate( templateID, payload )
        .then( emailJob => {
          return {
            data: emailJob.attrs.data,
            priority: emailJob.attrs.priority,
            willRunAt: emailJob.attrs.nextRunAt,
          };
        });
    }
  },
  Subscription: {
    newNotifications: {
      subscribe: ( root: any, { target }: GraphQLArgs, ctx: any ) => {
        return pubsub.asyncIterator( target );
      },
    }
  }
};
