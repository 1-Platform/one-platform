import { Document, model, Schema } from 'mongoose';
import { hash } from './util';

export interface APIKeyModel extends APIKey, Document { }

export const APIKeySchema = new Schema<APIKeyModel>( {
  accessToken: { type: String },
  hashKey: { type: String, default: function ( this: APIKeyModel ) { return hash( this.accessToken ); } },
  expiresOn: { type: Date },
  owner: {
    type: String,
    required: true,
  },
  ownerType: {
    type: String,
    enum: [ 'User', 'Group' ],
    required: true,
  },
  access: [ {
    role: { type: String },
    microservice: { type: String },
  } ],
  createdOn: { type: Date, default: Date.now() },
  createdBy: { type: String },
  updatedOn: { type: Date, default: Date.now() },
  updatedBy: { type: String },
} );

APIKeySchema.virtual( 'shortKey' ).get( function ( this: APIKeyModel ) {
  return this.accessToken.substr( 0, 7 );
} );

export const APIKeys = model<APIKeyModel>( 'APIKey', APIKeySchema );
