import {
  Schema, Document, Model, model,
} from 'mongoose';

export const GroupSchema: Schema = new Schema({
  name: { type: String, unique: true, required: true },
  cn: { type: String, unique: true, required: true },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

interface GroupModel extends Group, Document { }

interface GroupModelStatic extends Model<GroupModel> { }

export const Groups: Model<GroupModel> = model<GroupModel, GroupModelStatic>('Group', GroupSchema);
