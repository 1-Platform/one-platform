import _ from 'lodash';
import { NotificationTemplate } from './schema';

export const NotificationTemplateResolver: GraphQLResolver = {
  Query: {
    notificationTemplates () {
      return NotificationTemplate
        .find( { isEnabled: true } )
        .exec();
    },
    notificationTemplate ( parent, { id } ) {
      return NotificationTemplate
        .findById( id )
        .exec();
    },
    findNotificationTemplates ( parent, { selectors } ) {
      return NotificationTemplate
        .find( selectors )
        .exec();
    }
  },
  Mutation: {
    createNotificationTemplate ( parent, { template }, ctx ) {
      return new NotificationTemplate( {
        ...template,
        createdBy: ctx.rhatUUID
      } )
        .save();
    },
    updateNotificationTemplate ( parent, { id, template }, ctx ) {
      return NotificationTemplate
        .findByIdAndUpdate( id, {
          ...template,
          updatedBy: ctx.rhatUUID
        }, { new: true } )
        .exec();
    },
    deleteNotificationTemplate ( parent, { id } ) {
      return NotificationTemplate
        .findByIdAndRemove( id )
        .exec();
    }
  }
};
