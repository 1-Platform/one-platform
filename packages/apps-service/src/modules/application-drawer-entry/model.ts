import { Schema, model, Document, Model } from "mongoose";

export interface ApplicationDrawerEntryModel extends Document, ApplicationDrawerEntry { }

interface ApplicationDrawerEntryModelStatic extends Model<ApplicationDrawerEntryModel> { }

const ApplicationDrawerEntrySchema = new Schema<ApplicationDrawerEntryModel, ApplicationDrawerEntryModelStatic>({
  projectId: { type: String, required: true, },
  appId: { type: String, required: true, },
  label: { type: String, },
  path: { type: String, },
  icon: { type: String, },
  authenticate: { type: Boolean, default: false, },
  createdOn: { type: Date, default: Date.now, },
  createdBy: { type: String, },
});

const ApplicationDrawerEntrys = model<ApplicationDrawerEntryModel, ApplicationDrawerEntryModelStatic>('ApplicationDrawerEntrys', ApplicationDrawerEntrySchema);

export default ApplicationDrawerEntrys;
