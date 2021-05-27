import { Document, Model, model, Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
  name: String,
  title: String,
  uid: String,
  rhatUUID: String,
  isActive: Boolean,
  createdBy: String,
  createdOn: { type: Date, default: Date.now },
  updatedBy: String,
  updatedOn: { type: Date, default: Date.now },
} );

interface UserModel extends User, Document { }

interface UserModelStatic extends Model <UserModel> { }

export const Users: Model<UserModel> = model<UserModel, UserModelStatic>( 'User', UserSchema );
