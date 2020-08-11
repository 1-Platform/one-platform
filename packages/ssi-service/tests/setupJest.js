import 'whatwg-fetch';
/* Global function for a custom mock implementation for different test cases */
global.mockFetch = function mockFetch ( data ) {
  window.fetch = jest.fn().mockImplementation( ( args ) =>
    Promise.resolve( {
      ok: true,
      json: () => data
    } )
  );
};

/* Default mock jest implementation */
global.mockFetch( [] );


/* Mocking window.location for navigation testing */
let assignMock = jest.fn();
delete window.location;
window.location = { assign: assignMock };
afterEach( () => {
  assignMock.mockClear();
} );

/* Mocking up One Platform helpers */
window.OpAuthHelper = {
  onLogin: jest.fn(),
  getUserInfo: jest.fn( () => ( {} ) ),
};
window.OpNotification = {
  showToast: jest.fn(),
};
