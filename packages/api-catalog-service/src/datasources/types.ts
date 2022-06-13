import { Types } from 'mongoose';
import { NamespaceModel } from 'db/namespace';
import { SubscriptionModel } from 'db/subscription';
import { INamespaceDoc, ISpecSheetDoc } from 'db/types';
import { ApiCategory } from 'graph/types';

export type INameSpaceModelDoc = NamespaceModel & {
  _id: any;
};

export type ISubscriptionModelDoc = SubscriptionModel & {
  _id: any;
};

export type CreateNsDocArg = Omit<INamespaceDoc, 'tags' | 'schemas'> & {
  schemas: Omit<ISpecSheetDoc, 'lastCheckedOn'>[];
};

export type UpdateNsDocArg = Partial<Omit<INamespaceDoc, 'tags' | 'schemas'>> & {
  schemas?: Partial<ISpecSheetDoc & { id: string }>[];
};

export type ListNamespaceArg = {
  search?: string;
  mid?: string;
  sort?: 'createdOn' | 'updatedOn' | 'name';
  sortDir?: 1 | -1;
  category?: ApiCategory;
  limit?: number;
  offset?: number;
};

export type SubscriptionConfig = {
  namespaceID: Types.ObjectId;
  schemaID: Types.ObjectId;
  envrionmentIDs: Types.ObjectId[];
  email: string;
};

export type ApiCategoryCountArg = {
  search?: string;
  mid?: string;
};

export enum OutageAPIStatus {
  Operational = 'operational',
  Degraded_Performance = 'degraded_performance',
  Partial_Outage = 'partial_outage',
  Major_Outage = 'major_outage',
}

export type OutageAPI = {
  components: Array<{
    id: string;
    name: string;
    status: OutageAPIStatus;
    group_id: string | null;
  }>;
};

export type CMDBAPI = {
  result: Array<{ u_application_id: string; name: string }>;
};
