import { Document, Model, model, Schema } from 'mongoose';

export const SearchMapSchema: Schema = new Schema({
  appId: String,
  fields: [{
    from: String,
    to: String
  }],
  apiConfig: {
    mode: String,
    authorizationHeader: String,
    apiUrl: String,
    query: String,
    param: String
  },
  preferences: {
    iconUrl: String,
    searchUrlTemplate: String,
    searchUrlParams: [String]
  },
  createdBy: String,
  createdOn: { type: Date, default: Date.now },
  updatedBy: String,
  updatedOn: { type: Date, default: Date.now },
});

interface SearchMap extends SearchMapMode, Document { }

interface SearchMapStatic extends Model<SearchMap> { }

export const SearchMap: Model<SearchMap> = model<SearchMap, SearchMapStatic>('SearchMap', SearchMapSchema);
