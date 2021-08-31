import { Document, Model, model, Schema } from 'mongoose';

export const NSNotificationSchema: Schema = new Schema( {
    namespaceID: {
        type: Schema.Types.ObjectId,
        ref: 'Namespace',
        unique: true
    },
    subscribers: [ {
        email: {
            type: String,
        },
        group: {
            type: String,
            enum: [ 'MAILING_LIST', 'USER' ]
        },
    } ],
    createdOn: {
        type: Date,
        default: Date.now
    },
    updatedOn: {
        type: Date,
        default: Date.now
    }
} );

interface NSNotificationModel extends NsNotificationType, Document { }

type NSNotificationModelStatic = Model<NSNotificationModel>;

export const NSNotification: Model<NSNotificationModel> = model<NSNotificationModel, NSNotificationModelStatic>( 'NSNotification', NSNotificationSchema );

NSNotification.on( 'index', ( err )  => {
    if ( err ) {
        console.error( err );
    }
} );
