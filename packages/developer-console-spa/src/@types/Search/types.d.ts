declare namespace App {
  declare type SearchConfig = {
    isEnabled: boolean;
    id: string;
    /**
     * App ID for the related app (from the app-service)
     */
    appId: string;
    /**
     * Endpoint URL for the Search API
     */
    apiUrl: string;
    /**
     * HTTP Method for the Search API
     */
    method: string;
    /**
     * API Body (if method = POST / PUT / PATCH)
     */
    body: any;
    /**
     * Authorization config for the Search API
     */
    authorization: Search.Authorization;
    /**
     * Additional Query Parameters (optional)
     */
    apiQueryParams: Search.APIQueryParams[];
    /**
     * Additional headers (optional)
     */
    apiHeaders: Search.APIHeader[];
    /**
     * ContentType for the documents indexed using this config (eg. can be the App name)
     */
    contentType: string;
    /**
     * A map for transforming the input fields to the expected fields
     */
    fieldMap: Search.FieldMap;
    /**
     * Other custom preferences for templating
     */
    preferences: Partial<Search.Preferences>;

    createdBy: string;
    createdOn: Date;
    updatedBy: string;
    updatedOn: Date;
  }
}

declare namespace Search {
  type Authorization = {
    /**
     * Location where the authorization should be provided
     */
    location: 'header' | 'queryParam';
    /**
     * The Key used for Authorization
     * (default: Authorization for location=header, api_key for location=queryParam)
     */
    key: string;
    /**
     * Type of authorization (eg. Bearer, Basic, etc)
     * (ignore if location = queryParam)
     */
    authType: string;
    /**
     * Authorization credentials (eg. JWT or API Key)
     */
    credentials: string;
  };
  type APIQueryParams = {
    param: string;
    value: string;
  }
  type APIHeader = {
    key: string;
    value: string;
  }
  type FieldMap = {
    /**
     * Unique identifier for the document being indexed
     */
    id: string;
    /**
     * Title of the document being indexed
     */
    title: string;
    /**
     * Abstract / short summary of the document being indexed
     */
    abstract: string;
    /**
     * Brief Description of the document being indexed
     */
    description: string;
    /**
     * Icon for the document being indexed (optional for UI only)
     */
    icon: string;
    /**
     * The url related to the document being indexed
     */
    uri: string;
    /**
     * Tags for the document being indexed
     */
    tags: string;
    /**
     * UserID (rhatUUID) of the creator/owner of the document being indexed
     */
    createdBy: string;
    /**
     * Timestamp for when the document was created
     */
    createdDate: string;
    /**
     * UserID (rhatUUID) of the user that last modified the document
     */
    lastModifiedBy: string;
    /**
     * Timestamp for when the document was last modified
     */
    lastModifiedDate: string
  }

  type Preferences = {
    iconUrl: string;
    urlTemplate: string;
    urlParams: string[];
    titleTemplate: string;
    titleParams: string[];
  }
}
