import DataLoader from 'dataloader';

import { AnalyticsConfig } from 'datasource/analyticConfigDB';
import { MatomoAPI } from 'datasource/matomoAPI';
import { SentryAPI } from 'datasource/sentryAPI';

declare global {
  type IContext = {
    dataSources: {
      analyticsConfig: AnalyticsConfig;
      sentryAPI: SentryAPI;
      matomoAPI: MatomoAPI;
    };
    loaders: {
      user: DataLoader<string, User, string>;
    };
    user: { id?: string };
  };
}
