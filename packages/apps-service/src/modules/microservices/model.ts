import { Document, model, Model, Schema } from 'mongoose';
import { Microservices } from '.';
import uniqueIdFromPath from '../../utils/unique-id-from-path';

export interface MicroserviceModel extends Microservice, Document { }

interface MicroserviceModelStatic extends Model<MicroserviceModel> {
  isAuthorized ( microserviceId: any, userId: string ): Promise<boolean>;
}

const MicroserviceSchema = new Schema<MicroserviceModel, MicroserviceModelStatic>( {
  serviceId: {
    type: String,
    unique: true,
    default: function ( this: Microservice ) { return uniqueIdFromPath( this.name ); },
  },
  name: { type: String, unique: true, },
  description: { type: String, },
  isActive: { type: Boolean, default: false, },
  docsUrl: { type: String, },
  ownerId: { type: String, },
  permissions: [ {
    refId: { type: String, },
    refType: { type: String, enum: [ 'User', 'Group' ] },
    role: { type: String, required: true, },
  } ],
  serviceType: {
    type: String,
    enum: [ 'BUILTIN', 'HOSTED' ],
    default: App.Type.HOSTED,
    required: true,
  },
  createdBy: { type: String, },
  createdOn: { type: Date, default: Date.now, },
  updatedBy: { type: String, },
  updatedOn: { type: Date, default: Date.now, },
} );

MicroserviceSchema.static( 'isAuthorized', ( microserviceId: any, userId: string ) => {
  return Microservices.exists( { _id: microserviceId, ownerId: userId } );
} );

export default model<MicroserviceModel, MicroserviceModelStatic>( 'Micorservice', MicroserviceSchema );
