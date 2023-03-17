import {
  Document, Model, model, Schema,
} from 'mongoose';

export const SiteMapSchema: Schema = new Schema({
  url: { type: String },
  contentType: { type: String },
});

interface SiteMapModel extends Sitemap, Document {}

interface SiteMapStatic extends Model<SiteMapModel> {}

export const SiteMaps: Model<SiteMapModel> = model<SiteMapModel, SiteMapStatic>('SiteMap', SiteMapSchema);
