import { NotificationQueue, NotificationsArchive } from './schema';
import { NotificationConfig } from './notificationConfig/schema';
import NotificationsEngine from './engine';
import { pubsub } from './helpers';

export const NotificationsResolver = {
  Query: {
    listActiveNotifications ( root: any, { limit = 25 }: GraphQLArgs, ctx: any ) {
      return NotificationQueue.find().limit( limit ).exec();
    },
    listArchivedNotifications ( root: any, { limit = 25 }: GraphQLArgs, ctx: any ) {
      return NotificationsArchive.find().limit( limit ).exec();
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
    async newNotification ( root: any, { payload }: GraphQLArgs, ctx: any ) {
      const config = await NotificationConfig.findOne( { configID: payload.configID } ).exec().catch( err => { throw err; } );
      if ( !config ) {
        throw new Error( 'Notification Config not found' );
      }

      return NotificationsEngine.process( payload, config );
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
