import mock from './mockData.json';

export const GqlHelper = {
  fragments: {
    homeType: `on HomeType {
      _id name link entityType owners { uid name }
    }`,
  },
  execSimpleQuery: jest.fn( ( ...args ) => {
    return Promise.resolve( { data: { getHomeTypeBy: [ mock ] } } );
  } )
};
