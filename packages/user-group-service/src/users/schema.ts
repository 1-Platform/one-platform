import { Document, Model, model, Schema } from 'mongoose';

export const UserSchema: Schema = new Schema({
  cn: String,
  rhatJobTitle: String,
  uid: String,
  isActive: String,
  rhatCostCenter: String,
  rhatCostCenterDesc: String,
  rhatGeo: String,
  givenName: String,
  displayName: String,
  employeeType: String,
  rhatLocation: String,
  rhatOfficeLocation: String,
  mobile: String,
  mail: String,
  country: String,
  homePhone: String,
  telephoneNumber: String,
  rhatPhoneExt: String,
  objectClass: String,
  rhatUuid: { type: String , unique: true},
  serviceAccount: Boolean,
  manager: String,
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
} );

interface UserModel extends User, Document { }

interface UserModelStatic extends Model <UserModel> { }

export const Users: Model<UserModel> = model<UserModel, UserModelStatic>( 'User', UserSchema );
