import { Document, Model, model, Schema } from "mongoose";

export const LHSpaConfigSchema: Schema = new Schema({
  appId: {
    type: String,
    unique: true,
  },
  projectId: String,
  branch: String,
  createdOn: { type: Date, default: Date.now },
  createdBy: String,
  updatedOn: { type: Date, default: Date.now },
  updatedBy: String,
});

export interface LHSpaConfigModel extends LHSpaConfigType, Document {}

interface LHSpaConfigModelStatic extends Model<LHSpaConfigModel> {}

export const LHSpaConfig: Model<LHSpaConfigModel> = model<
  LHSpaConfigModel,
  LHSpaConfigModelStatic
>("LHSpaConfig", LHSpaConfigSchema);
