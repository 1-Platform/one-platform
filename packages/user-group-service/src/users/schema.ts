import { Document, Model, model, Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
  cn: String,
  rhatJobTitle: String,
  uid: String,
  isActive: Boolean,
  rhatCostCenter: String,
  rhatCostCenterDesc: String,
  employeeType: String,
  rhatOfficeLocation: String,
  mail: String,
  rhatUuid: { type: String , unique: true},
  serviceAccount: Boolean,
  manager: String,
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
} );

interface UserModel extends User, Document { }

interface UserModelStatic extends Model <UserModel> { }

export const Users: Model<UserModel> = model<UserModel, UserModelStatic>( 'User', UserSchema );
