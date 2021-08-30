import { NSNotification } from './schema';
export const NSNotificationResolver = {
    Query: {
        listNSNotificationConfigs ( root: any, args: any, ctx: any ) {
            return NSNotification.find()
                .populate( "namespaceID" )
                .lean()
                .then( ( NSNotifications: NsNotificationType[] ) => {
                    return NSNotifications.map( ( data: NsNotificationType ) => {
                        data.namespace = data.namespaceID as NamespaceType;
                        return data;
                    } );
                } );
        },
        getNSNotificationConfigById ( root: any, { _id }: GetNsNotificationConfigByIdArgs, ctx: any ) {
            return NSNotification.findById( _id )
                .populate( "namespaceID" )
                .lean()
                .then( ( NSNotification: NsNotificationType | any ) => {
                    NSNotification.namespace = NSNotification.namespaceID as NamespaceType;
                    return NSNotification;
                } );
        }
    },
    Mutation: {
        createNSNotificationConfig ( root: any, { payload }: CreateNsNotificationConfigArgs, ctx: any ) {
            ( !payload?.createdOn ) ? payload.createdOn = new Date() : null;
            return new NSNotification( payload ).save();
        },
        updateNSNotificationConfig ( root: any, { _id, payload }: UpdateNsNotificationConfigArgs, ctx: any ) {
            ( !payload?.updatedOn ) ? payload.updatedOn = new Date() : null;
            return NSNotification.findByIdAndUpdate( _id, payload, {
                new: true
            } ).exec();
        },
        deleteNSNotificationConfig ( root: any, { _id }: DeleteNsNotificationConfigArgs, ctx: any ) {
            return NSNotification.findByIdAndRemove( _id ).exec();
        },
        createNSSubscription ( root: any, { payload }: CreateNsSubscriptionArgs, ctx: any ) {
            console.log( payload );

            return NSNotification.findByIdAndUpdate(
                payload?._id,
                {
                    $push: { subscribers: payload?.email },
                },
                { new: true }
            ).exec();
        }
    }
};
