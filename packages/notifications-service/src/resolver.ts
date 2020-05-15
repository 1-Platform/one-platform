import { NotificationsConfig } from './schema';
import { pubsub } from './helpers';

const NOTIFICATIONS_CONFIG_UPDATE = 'NOTIFICATIONS_CONFIG_UPDATE';
const NOTIFICATIONS_CONFIG_CREATE = 'NOTIFICATIONS_CONFIG_CREATE';

export const NotificationsResolver = {
  Query: {
    // queries
    listNotificationsConfigs ( root: any, args: any, ctx: any ) {
      return NotificationsConfig.find()
        .then( response => response )
        .catch( err => err );
    },
    getNotificationsConfigById ( root: any, args: any, ctx: any ) {
      // fetch the id from args.id
      return NotificationsConfig.findById( args._id )
        .then( response => response )
        .catch( err => err );
    }
  },
  Mutation: {
    // mutations
    createdNotificationsConfig ( root: any, args: any, ctx: any ) {
      const data = new NotificationsConfig( args.input );
      return data.save()
        .then( response => response )
        .catch( err => err );
    },
    updatedNotificationsConfig ( root: any, args: any, ctx: any ) {
      /* Optional: if you want to send graphql subscription updates when this query is called) */
      // pubsub.publish(Notifications_UPDATE, data);
      return NotificationsConfig.findById( args.input._id )
        .then( response => {
          return Object.assign( response, args.input )
            .save()
            .then( ( data: any ) => data );
        } )
        .catch( ( err: any ) => err );
    },
    deleteNotificationsConfig ( root: any, args: any, ctx: any ) {
      return NotificationsConfig.findByIdAndRemove( args._id )
        .then( response => response )
        .catch( err => err );
    },
  },
  // Subscription: {
  //   createdNotificationsConfig: {
  //     subscribe: () => pubsub.asyncIterator( NOTIFICATIONS_CONFIG_CREATE )
  //   },
  //   updatedNotificationsConfig: {
  //     subscribe: () => pubsub.asyncIterator( NOTIFICATIONS_CONFIG_UPDATE )
  //   },
  // },
};
