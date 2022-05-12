export enum Jobs {
  SUBSCRIPTION_PARENT = 'subscription-master',
  SUBSCRIPTION_CHILD = 'subscription-childs',
}

export type GraphqlChange = { message: string; type: string; path?: string };

export type GraphqlDiff = {
  hasChanged: boolean;
  breakingDiff: GraphqlChange[];
  nonBreakingDiff: GraphqlChange[];
  dangerous: GraphqlChange[];
};

export type OpenAPIChange = {
  action: string;
  entity: string;
  source: string;
  destination: string;
};

export type OpenAPIDiff = {
  hasChanged: boolean;
  breakingDiff: OpenAPIChange[];
  nonBreakingDiff: OpenAPIChange[];
};
