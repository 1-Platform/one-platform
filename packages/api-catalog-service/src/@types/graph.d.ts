import DataLoader from 'dataloader';
import { CMDBDataSourceAPI } from 'datasources/cmdbDatasourceAPI';
import { NamespaceDB } from 'datasources/namespaceDb';
import { OutageStatusAPI } from 'datasources/outageStatusAPI';
import { SpecStoreDB } from 'datasources/specstoreDB';
import { SubscriptionDB } from 'datasources/subscriptionDB';
import { OutageAPI } from 'datasources/types';
import { ISubscriptionDoc } from 'db/types';

declare global {
  type Maybe<T> = T | null;

  type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: any;
  };

  type IContext = {
    dataSources: {
      namespaceDB: NamespaceDB;
      subscriptionDB: SubscriptionDB;
      specStoreDB: SpecStoreDB;
      outageStatusAPI: OutageStatusAPI;
      cmdbCodeAPI: CMDBDataSourceAPI;
    };
    loaders: {
      user: DataLoader<string, IUser, string>;
      subscriptionStatus: DataLoader<{ userId: string; envId: string }, ISubscriptionDoc, string>;
      outageStatus: DataLoader<string, OutageAPI['components'][0], string>;
    };
    user: { id: string };
  };
}
