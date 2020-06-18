import { NotificationConfig } from './schema';
import { GqlHelper } from '../helpers';
import { isValidObjectId } from 'mongoose';

export const NotificationConfigResolver: any = {
  Query: {
    listNotificationConfigs ( root: any, args: GraphQLArgs, ctx: any ) {
      return NotificationConfig
        .find()
        .exec()
        .then( async notificationConfigs => {
          /* Constructing getHomeTypeBy queries */
          const queries = notificationConfigs
            .reduce<string[]>( ( acc, notificationConfig ) => {
              if ( !notificationConfig.source || acc.includes( notificationConfig.source ) ) {
                return acc;
              }
              return [
                ...acc,
                notificationConfig.source,
              ];
            }, [] )
            .map( ( source, index ) => {
              return `source_${ index }: getHomeType(_id: "${ source }") { ...homeType }`;
            } );

          /* Executing the queries */
          const resolvedSources = queries.length > 0
            ? await GqlHelper.execSimpleQuery( { queries, fragments: [ GqlHelper.fragments.homeType ] } )
              .then( res => res.data )
            : null;

          /* Merging the query output with the NotificationConfig output */
          return notificationConfigs
            .map( ( notificationConfig, index ) => {
              notificationConfig.source = resolvedSources
                ? resolvedSources[ `source_${ index }` ]
                : { _id: notificationConfig.source };

              return notificationConfig;
            } );
        } )
        .catch( err => {
          throw err;
        } );
    },
    getNotificationConfigsBy ( root: any, { selectors }: GraphQLArgs, ctx: any ) {
      return NotificationConfig
        .find( selectors )
        .lean<NotificationConfig>()
        .exec()
        .then( async notificationConfigs => {
          /* Constructing getHomeTypeBy queries */
          const queries = notificationConfigs
            .reduce<string[]>( ( acc, notificationConfig ) => {
              if ( !notificationConfig.source || acc.includes( notificationConfig.source ) ) {
                return acc;
              }
              return [
                ...acc,
                notificationConfig.source,
              ];
            }, [] )
            .map( ( source, index ) => {
              return `source_${ index }: getHomeType(_id: "${ source }") { ...homeType }`;
            } );

          /* Executing the queries */
          const resolvedSources = queries.length > 0
            ? await GqlHelper.execSimpleQuery( { queries, fragments: [ GqlHelper.fragments.homeType ] } )
              .then( res => res.data )
            : null;

          /* Merging the query output with the NotificationConfig output */
          return notificationConfigs
            .map( ( notificationConfig, index ) => {
              notificationConfig.source = resolvedSources
                ? resolvedSources[ `source_${ index }` ]
                : { _id: notificationConfig.source };

              return notificationConfig;
            } );
        } ).catch( err => {
          throw err;
        } );
    },
    getNotificationConfigByID ( root: any, { id }: GraphQLArgs, ctx: any ) {
      return NotificationConfig
        .findById( id )
        .lean<NotificationConfig>()
        .exec();
    }
  },
  Mutation: {
    createNotificationConfig ( root: any, { notificationConfig }: GraphQLArgs, ctx: any ) {
      if ( !isValidObjectId( notificationConfig.source ) ) {
        throw new Error( 'Source is invalid' );
      }

      return new NotificationConfig( notificationConfig )
        .save();
    },
    updateNotificationConfig ( root: any, { notificationConfig }: GraphQLArgs, ctx: any ) {
      if ( !isValidObjectId( notificationConfig.source ) ) {
        throw new Error( 'Source is invalid' );
      }

      return NotificationConfig
        .findByIdAndUpdate( notificationConfig.id, notificationConfig, { new: true } )
        .exec();
    },
    deleteNotificationConfig ( root: any, args: GraphQLArgs, ctx: any ) {
      return NotificationConfig.findByIdAndRemove( args.id ).exec();
    },
  },
};
