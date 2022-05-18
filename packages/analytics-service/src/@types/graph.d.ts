import DataLoader from 'dataloader';

import { AnalyticsConfig } from 'datasource/analyticConfigDB';
import { SentryAPI } from 'datasource/sentryAPI';

declare global {
  type IContext = {
    dataSources: {
      analyticsConfig: AnalyticsConfig;
      sentryAPI: SentryAPI;
    };
    loaders: {
      user: DataLoader<string, User, string>;
    };
    user: { id?: string };
  };
}
