import { Document, Model, model, Schema } from "mongoose";

export const PropertySchema: Schema = new Schema({
  name: String,
  description: String,
  projectId: String,
  apps: [{ name: String, branch: String }],
  createdOn: { type: Date, default: Date.now },
  createdBy: String,
  updatedOn: { type: Date, default: Date.now },
  updatedBy: String,
});

export interface PropertyModel extends PropertyType, Document {}

interface PropertyModelStatic extends Model<PropertyModel> {}

export const Property: Model<PropertyModel> = model<
  PropertyModel,
  PropertyModelStatic
>("Property", PropertySchema);
