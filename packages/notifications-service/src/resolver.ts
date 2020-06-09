import { NotificationsConfig } from './schema';
import { GqlHelper } from './helpers';

const NOTIFICATIONS_CONFIG_UPDATE = 'NOTIFICATIONS_CONFIG_UPDATE';
const NOTIFICATIONS_CONFIG_CREATE = 'NOTIFICATIONS_CONFIG_CREATE';

export const NotificationsResolver: any = {
  Query: {
    listNotificationsConfigs ( root: any, args: GraphQLArgs, ctx: any ) {
      return NotificationsConfig
        .find()
        .exec()
        .then( async notificationConfigs => {
          /* Constructing getHomeTypeBy queries */
          const queries = notificationConfigs
            .reduce<string[]>( ( acc, notificationConfig ) => {
              if ( acc.includes( notificationConfig.source ) ) {
                return acc;
              }
              return [
                ...acc,
                notificationConfig.source,
              ];
            }, [] )
            .map( ( source, index ) => {
              return `source_${ index }: getHomeTypeBy(input: { _id: "${ source }" }) { _id name link entityType owners { uid name } }`;
            } );

          /* Executing the queries */
          const resolvedSources = await GqlHelper.execSimpleQuery( { queries, fragments: [ GqlHelper.fragments.homeType ] } )
            .then( res => res.data );

          /* Merging the query output with the NotificationsConfig output */
          return notificationConfigs
            .map( ( notificationConfig, index ) => {
              notificationConfig.source = resolvedSources[ `source_${ index }` ][ 0 ];
              return notificationConfig;
            } );
        } ).catch( err => {
          throw err;
        } );
    },
    getNotificationsConfigBy ( root: any, { selectors }: GraphQLArgs, ctx: any ) {
      return NotificationsConfig
        .find( selectors )
        .lean<NotificationsConfigType>()
        .exec()
        .then( async notificationConfigs => {
          /* Constructing getHomeTypeBy queries */
          const queries = notificationConfigs
            .reduce<string[]>( ( acc, notificationConfig ) => {
              if ( acc.includes( notificationConfig.source ) ) {
                return acc;
              }
              return [
                ...acc,
                notificationConfig.source,
              ];
            }, [] )
            .map( ( source, index ) => {
              return `source_${ index }: getHomeTypeBy(input: { _id: "${ source }" }) { _id name link entityType owners { uid name } }`;
            } );

          /* Executing the queries */
          const resolvedSources = await GqlHelper.execSimpleQuery( { queries, fragments: [ GqlHelper.fragments.homeType ] } )
            .then( res => res.data );

          /* Merging the query output with the NotificationsConfig output */
          return notificationConfigs
            .map( ( notificationConfig, index ) => {
              notificationConfig.source = resolvedSources[ `source_${ index }` ][ 0 ];
              return notificationConfig;
            } );
        } ).catch( err => {
          throw err;
        } );
    },
    getNotificationsConfigByID ( root: any, { id }: GraphQLArgs, ctx: any ) {
      return NotificationsConfig
        .findById( id )
        .lean<NotificationsConfigType>()
        .exec();
    }
  },
  Mutation: {
    createNotificationsConfig ( root: any, { notificationsConfig }: GraphQLArgs, ctx: any ) {
      const data = new NotificationsConfig( notificationsConfig );
      return data.save();
    },
    updateNotificationsConfig ( root: any, { notificationsConfig }: GraphQLArgs, ctx: any ) {
      return NotificationsConfig
        .findByIdAndUpdate( notificationsConfig.id, notificationsConfig, { new: true } )
        .exec();
    },
    deleteNotificationsConfig ( root: any, args: GraphQLArgs, ctx: any ) {
      return NotificationsConfig.findByIdAndRemove( args.id ).exec();
    },
  },
};
