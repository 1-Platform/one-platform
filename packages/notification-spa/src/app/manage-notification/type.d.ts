type Day = {
    day: string,
    status: boolean,
}
type EventType = {
    name: string,
    status: boolean
}
type Schedule = {
    startDate: Date,
    repeats: Day[],
}
type NotificationSchema = {
    template: string,
    channel: string,
    type: string,
    typeOption: Event[] | Schedule | null,
    createdBy: string,
    createdOn: Date,
    modifiedBy: string | null,
    modifiedOn: Date | null,
}