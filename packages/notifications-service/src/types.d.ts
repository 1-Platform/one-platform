declare module '*.graphql';
declare module '*.json';

type ScheduledType = {
    startDate: string,
    time: string
}

type TriggerBasedType = {
    action: string
}

// define your types here
type NotificationsConfigType = {
    template: string,
    source: string,
    channel: string,
    type: string,
    typeOptions: ScheduledType | TriggerBasedType
    target: string,
    createdBy: string,
    createdOn: Date,
    modifiedBy: string,
    modifiedOn: Date
}
