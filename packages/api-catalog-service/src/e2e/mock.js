const namespaceMock = {
  id: '6167ba700ae8f84a2ebfadb9',
  name: 'Petstore',
  slug: 'petstore',
  description:
    'This is a sample server Petstore server. You can find out more about Swagger at http://swagger.io or on irc.',
  category: 'REST',
  tags: ['rest', 'one'],
  owners: [
    {
      mid: '7ab20a62-0d75-11e7-ae22-28d244ea5a6d',
      group: 'USER',
    },
  ],
  appUrl: 'https://petstore.redhat.com',
  schemaEndpoint: 'https://petstore.swagger.io/v2/swagger.json',
  headers: [
    {
      key: 'Content-Type',
      value: 'application/json',
    },
  ],
  environments: [
    {
      name: 'production',
      apiBasePath: 'https://petstore.swagger.io/v2/swagger.json',
    },
  ],
  createdBy: '7ab20a62-0d75-11e7-ae22-28d244ea5a6d',
};

const subscriberMock = {
  id: namespaceMock.id,
  payload: {
    email: 'oommachan@redhat.com',
    group: 'USER',
  },
};

module.exports = {
  namespaceMock,
  subscriberMock,
};
