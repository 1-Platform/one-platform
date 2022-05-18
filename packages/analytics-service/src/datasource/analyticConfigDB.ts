import { MongoDataSource } from 'apollo-datasource-mongodb';

import { AnalyticsModel } from 'db/analytics';
import { AnalyticsDoc } from 'db/types';

export class AnalyticsConfig extends MongoDataSource<AnalyticsModel> {
  async getConfigByAppId(appId: string): Promise<AnalyticsDoc | undefined | null> {
    try {
      const doc = await this.findByFields({ appId });
      return doc?.[0];
    } catch (error) {
      return error;
    }
  }

  async listConfig(limit = 50, offset = 0) {
    return this.model.find().skip(offset).limit(limit).exec();
  }

  getConfigById(id: string) {
    return this.findOneById(id);
  }

  async createConfig(arg: AnalyticsDoc) {
    const AnalyticModel = this.model;
    const doc = new AnalyticModel(arg);
    return doc.save();
  }

  async updateConfigById(id: string, arg: Partial<AnalyticsDoc>) {
    return this.model
      .findByIdAndUpdate(id, arg, {
        new: true,
      })
      .exec();
  }

  deleteConfigById(id: string) {
    return this.model.findByIdAndDelete(id, { new: true }).exec();
  }
}
