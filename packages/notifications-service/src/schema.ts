import { Schema, Model, Document, model } from 'mongoose';

/**
 * Notifications Queue
 */
const NotificationQueueSchema: Schema = new Schema<OpNotification>( {
  subject: { type: String, required: true, },
  body: { type: String, },
  link: { type: String, },
  data: { type: Schema.Types.Mixed, },
  config: { type: Schema.Types.ObjectId, ref: 'NotificationConfig', required: true },
  secondaryTargets: { type: [ String ], },
  startDate: { type: Date, required: true, },
  endDate: { type: Date, },
  recurring: { type: Boolean, default: false, },
  action: { type: String, },
  createdOn: { type: Date, default: Date.now, },
  createdBy: { type: String, required: true },
  updatedOn: { type: Date, default: Date.now, },
  updatedBy: { type: String, },
}, { typePojoToMixed: false } );

export interface NotificationModel extends OpNotification, Document { }
interface NotificationModelStatic extends Model<NotificationModel> { }

export const NotificationQueue: Model<NotificationModel> =
  model<NotificationModel, NotificationModelStatic>( 'NotificationQueue', NotificationQueueSchema, 'notificationqueue' );

/**
 * Notifications Archive
*/
const NotificationArchiveSchema: Schema = new Schema<NotificationArchive>( {
  /* Inheriting the NotificationQueue Schema */
  ...NotificationQueueSchema.obj,
  /* Archive specific fields */
  status: { type: String, enum: [ 'SUCCESS', 'FAILED', ], default: false, },
  reciept: { type: String, },
  sentOn: { type: Date, default: Date.now, },
  messageId: { type: String, },
} );

interface NotificationsArchiveModel extends NotificationArchive, Document { }
interface NotificationsArchiveModelStatic extends Model<NotificationsArchiveModel> { }

export const NotificationsArchive: Model<NotificationsArchiveModel> =
  model<NotificationsArchiveModel, NotificationsArchiveModelStatic>(
    'NotificationsArchive', NotificationArchiveSchema
  );
