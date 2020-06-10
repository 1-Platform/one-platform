import { Document, Model, model, Schema } from 'mongoose';

const NotificationTypeSchema = new Schema(
  { type: String },
  { discriminatorKey: 'typeOptions' }
);
const NotificationType = model( 'NotificationsType', NotificationTypeSchema );

const TriggeredBasedType = NotificationType.discriminator(
  'trigger-based',
  new Schema( {
    action: {
      type: String,
      enum: [ 'create', 'update', 'delete', 'custom' ],
      default: 'create',
    },
  } )
);

const ScheduledType = NotificationType.discriminator(
  'scheduled',
  new Schema( {
    startDate: String,
    time: String,
  } )
);

export const NotificationConfigSchema: Schema = new Schema( {
  template: String,
  source: String,
  channel: {
    type: String,
    enum: [ 'email', 'popup', 'banner', 'webhook' ],
    default: 'email',
  },
  type: {
    type: String,
    enum: [ 'trigger-based', 'scheduled' ],
    default: 'trigger-based',
  },
  target: String,
  createdBy: String,
  createdOn: Date,
  updatedBy: String,
  updatedOn: Date,
} );

interface NotificationConfigModel extends NotificationConfigType, Document { }

interface NotificationConfigModelStatic
  extends Model<NotificationConfigModel> { }

export const NotificationConfig: Model<NotificationConfigModel> = model<
  NotificationConfigModel,
  NotificationConfigModelStatic
>( 'NotificationConfig', NotificationConfigSchema );
