type SSOAuthResponse = {
  access_token?: string;
};

type SearchResponse = {
  response: {
    docs?: any[];
    [x: string]: any;
  };
};

type IndexResponse = any;
type DeleteIndexResponse = any;
