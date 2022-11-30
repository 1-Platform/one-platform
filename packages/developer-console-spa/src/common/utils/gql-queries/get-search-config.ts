export const projectSearchConfig = /* GraphQL */`
query ($projectId: String!) {
  searchConfig: getSearchMapsByApp(appId: $projectId) {
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
