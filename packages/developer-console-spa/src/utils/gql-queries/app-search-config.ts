export const appSearchConfig = /* GraphQL */`
query SearchConfig($appId: String!) {
  searchConfig: getSearchMapsByApp(appId: $appId) {
    method
    apiUrl
    body
    contentType
    authorization {
      authType
      credentials
      key
      location
    }
    apiQueryParams {
      param
      value
    }
    fieldMap {
      id
      title
      abstract
      description
      icon
      uri
      tags
      createdBy
      createdDate
      lastModifiedBy
      lastModifiedDate
    }
    preferences {
      iconUrl
      urlTemplate
      urlParams
      titleTemplate
      titleParams
    }
  }
}
`;
