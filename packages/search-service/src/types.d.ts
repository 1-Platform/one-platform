declare module '*.graphql';
declare module '*.json';

// Search Config Types
type Doc = {
    id: string;
    title: string;
    abstract: string;
    description: string;
    content_type: string;
    solr_command: string;
    icon: string;
    uri: string;
    tags: string[];
    timestamp: string;
    lastModifiedDate: string;
    createdDate: string;
    createdBy: string;
    lastModifiedBy: string;
};

type ResponseHeader = {
    zkConnected: boolean;
    status: number;
    QTime: number;
};

type ResponseContent = {
    numFound: number;
    start: number;
    docs: Doc[];
};

type SearchResponseType = {
    responseHeader: ResponseHeader;
    response: ResponseContent;
};

type SearchResponseCode = {
    status: number;
};

// Search Map Types

type FieldList = {
    from: string;
    to: string;
}


type SearchMapMode = {
    appId: string;
    apiConfig: {
        mode: string;
        apiUrl: string;
        query: string;
        param: string;
        authorizationHeader: string;
    };
    fields: FieldList[];
    preferences: {
        iconUrl: string;
        titleTemplate: string;
        titleParams: string;
        urlTemplate: string;
        urlParams: string[];
    },
    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
}
