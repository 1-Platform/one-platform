const searchIndexMock = {
  dataSource: 'oneportal',
  documents: {
    id: '123123',
    title: 'test title',
    abstract: 'test abstract',
    description: 'test description',
    icon: 'assets/test.svg',
    uri: 'https://test.com/123123',
    tags: 'test',
    contentType: 'Test',
    createdBy: 'bot',
    createdDate: '2022-01-04T05:17:16.244Z',
    lastModifiedBy: 'bot',
    lastModifiedDate: '2022-01-04T05:17:16.244Z'
  }
}

const searchMapMock = {
  _id: '6167ba700ae8f84a2ebfadb9',
  appId: '123',
  apiConfig: {
    mode: 'GET',
    authorizationHeader: 'Bearer Test',
    apiUrl: 'http://foo.com',
    query: null,
    param: null,
  },
  fields: [
    {
      from: 'desc',
      to: 'description',
    },
  ],
  preferences: {
    iconUrl: 'assets/test.svg',
    urlTemplate: 'https://foo.com/appId',
    urlParams: ['appId'],
    titleTemplate: 'App in Platform',
    titleParams: ['App'],
  },
  createdBy: '7ab20a62-0d75-11e7-ae22-28d244ea5a6d',
};

module.exports = {
  searchIndexMock,
  searchMapMock
}
