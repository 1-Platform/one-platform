import { Document, Model, model, Schema } from 'mongoose';

export const SearchMapSchema: Schema = new Schema({
  appId: { type: String, },
  apiUrl: { type: String, },
  method: { type: String, default: 'GET' },
  body: { type: String, get: JSON.parse, set: JSON.stringify },
  authorization: {
    location: { type: String, enum: [ 'header', 'queryParam' ] },
    key: { type: String, },
    authType: { type: String, },
    credentials: { type: String, },
  },
  apiQueryParams: [ {
    param: { type: String, },
    value: { type: String, },
  } ],
  apiHeaders: [ {
    key: { type: String, },
    value: { type: String, },
  } ],

  contentType: { type: String, },

  fieldMap: {
    id: { type: String, default: 'id' },
    title: { type: String, default: 'title' },
    abstract: { type: String, default: 'abstract' },
    description: { type: String, default: 'description' },
    icon: { type: String, default: 'icon' },
    uri: { type: String, default: 'uri' },
    tags: { type: String, default: 'tags' },
    createdBy: { type: String, default: 'createdBy' },
    createdDate: { type: String, default: 'createdDate' },
    lastModifiedBy: { type: String, default: 'lastModifiedBy' },
    lastModifiedDate: { type: String, default: 'lastModifiedDate' },
  },

  preferences: {
    iconUrl: { type: String, },
    urlTemplate: { type: String, },
    urlParams: [ { type: String, } ],
    titleTemplate: { type: String, },
    titleParams: [ { type: String, } ],
  },

  createdBy: { type: String, },
  createdOn: { type: Date, default: Date.now },
  updatedBy: { type: String, },
  updatedOn: { type: Date, default: Date.now },
});

interface SearchMapModel extends SearchMap, Document { }

interface SearchMapStatic extends Model<SearchMapModel> { }

export const SearchMaps: Model<SearchMapModel> = model<SearchMapModel, SearchMapStatic>('SearchMap', SearchMapSchema);
