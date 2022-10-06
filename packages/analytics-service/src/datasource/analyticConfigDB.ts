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

  async updateConfigByAppId(appId: string, arg: Partial<AnalyticsDoc>) {
    return this.model
      .findOneAndUpdate({ appId }, arg, {
        new: true,
        upsert: true,
      })
      .exec();
  }

  deleteConfigByAppId(appId: string) {
    return this.model.findOneAndDelete({ appId }, { new: true }).exec();
  }
}
