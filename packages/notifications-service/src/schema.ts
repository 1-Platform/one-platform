import { Document, Model, model, Schema } from 'mongoose';

const NotificationsTypeSchema = new Schema( { type: String }, { discriminatorKey: 'typeOptions' } );
const NotificationsType = model( 'NotificationsType', NotificationsTypeSchema );

const TriggeredBasedType = NotificationsType.discriminator( 'trigger-based', new Schema( {
    action: { type: String, enum: [ 'create', 'update', 'delete', 'custom' ], default: 'create' },
} ) );

const ScheduledType = NotificationsType.discriminator( 'scheduled', new Schema( {
    startDate: String,
    time: String
} ) );

export const NotificationsConfigSchema: Schema = new Schema( {
    template: String,
    source: String,
    channel: { type: String, enum: [ 'email', 'popup', 'banner', 'webhook' ], default: 'email' },
    type: { type: String, enum: [ 'trigger-based', 'scheduled' ], default: 'trigger-based' },
    target: String,
    createdBy: String,
    createdOn: Date,
    modifiedBy: String,
    modifiedOn: Date
} );

interface NotificationsConfigModel extends NotificationsConfigType, Document { }

interface NotificationsConfigModelStatic extends Model<NotificationsConfigModel> { }

export const NotificationsConfig: Model<NotificationsConfigModel> =
    model<NotificationsConfigModel, NotificationsConfigModelStatic>( 'NotificationsConfig', NotificationsConfigSchema );
