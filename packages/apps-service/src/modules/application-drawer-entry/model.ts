import { Schema, model, Document, Model } from "mongoose";

export interface ApplicationDrawerEntryModel extends Document, ApplicationDrawerEntry { }

interface ApplicationDrawerEntryModelStatic extends Model<ApplicationDrawerEntryModel> { }

const ApplicationDrawerEntrySchema = new Schema<ApplicationDrawerEntryModel, ApplicationDrawerEntryModelStatic>({
  projectId: { type: Schema.Types.ObjectId, required: true, },
  appId: { type: Schema.Types.ObjectId, required: true, },
  label: { type: String, },
});

const ApplicationDrawerEntrys = model<ApplicationDrawerEntryModel, ApplicationDrawerEntryModelStatic>('ApplicationDrawerEntrys', ApplicationDrawerEntrySchema);

export default ApplicationDrawerEntrys;
