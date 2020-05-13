import { Document, Model, model, Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
  name: String,
  title: String,
  uid: String,
  rhatUUID: String,
  isActive: Boolean,
  memberOf: [String],
  apiRole: String,
  createdBy: String,
  createdOn: Date,
  updatedBy: String,
  updatedOn: Date,
} );

interface UserModel extends UserType , Document { }

interface UserModelStatic extends Model <UserModel> { }

export const User: Model<UserModel> = model<UserModel, UserModelStatic>('User', UserSchema);
