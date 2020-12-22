import { Document, Model, model, Schema } from 'mongoose';
import { createHash } from 'crypto';

const NotificationConfigSchema: Schema<NotificationConfig> = new Schema( {
  configID: { type: String, },
  template: { type: String, },
  defaultLink: { type: String, },
  source: { type: String, },
  targets: { type: [ String ], required: true, },
  channel: {
    type: String,
    enum: [ 'EMAIL', 'PUSH', 'BANNER' ],
    required: true,
  },
  type: {
    type: String,
    enum: [ 'TRIGGERED', 'SCHEDULED' ],
    required: true,
  },
  action: { type: String, },
  createdOn: { type: Date, default: Date.now, },
  createdBy: { type: String, required: true },
  updatedOn: { type: Date, default: Date.now, },
  updatedBy: { type: String, },
}, { toObject: { getters: true, virtuals: true } } );

NotificationConfigSchema.post( 'save', ( doc: NotificationConfigModel ) => {
  if ( !doc.configID ) {
    doc.configID = createHash( 'md5' ).update(String(doc._id)).digest( 'hex' );
    doc.save();
  }
} );

export interface NotificationConfigModel extends NotificationConfig, Document {
  configID: string;
}
interface NotificationConfigModelStatic
  extends Model<NotificationConfigModel> { }

export const NotificationConfig: Model<NotificationConfigModel> =
  model<NotificationConfigModel, NotificationConfigModelStatic>( 'NotificationConfig', NotificationConfigSchema );
