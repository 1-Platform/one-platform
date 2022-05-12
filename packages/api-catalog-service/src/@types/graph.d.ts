import DataLoader from 'dataloader';
import { NamespaceDB } from 'datasources/namespaceDb';
import { SpecStoreDB } from 'datasources/specstoreDB';
import { SubscriptionDB } from 'datasources/subscriptionDB';
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
    };
    loaders: {
      user: DataLoader<string, IUser, string>;
      subscriptionStatus: DataLoader<{ userId: string; envId: string }, ISubscriptionDoc, string>;
    };
    user: { id: string };
  };
}
