import { Document, Model, model, Schema } from 'mongoose';

export const LdapSchema: Schema = new Schema({
});

interface LdapModel extends LdapType , Document { }

interface LdapModelStatic extends Model <LdapModel> { }

export const Ldap: Model<LdapModel> = model<LdapModel, LdapModelStatic>('Ldap', LdapSchema);
