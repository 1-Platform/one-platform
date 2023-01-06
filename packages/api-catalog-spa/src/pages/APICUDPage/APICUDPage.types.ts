import * as yup from 'yup';
import { ApiCategory, Header } from 'api/types';

import { wizardValidationSchemas } from './APICUDPage.helpers';

export interface FormData extends yup.InferType<typeof wizardValidationSchemas[3]> {}

export type UserRoverDetails = {
  cn: string;
  mail: string;
  uid: string;
  rhatUUID: string;
  rhatJobTitle: string;
  employeeType: string;
};

export type CMDBCode = {
  appID: string;
  name: string;
};

export type UserSearchQuery = { searchRoverUsers: UserRoverDetails[] };

export type ListCMDBCodeQuery = { listCMDBCodes: CMDBCode[] };

export type HandleSchemaValidationArg = {
  envSlug?: string;
  category?: ApiCategory;
  schemaEndpoint?: String;
  headers: Header[];
};
