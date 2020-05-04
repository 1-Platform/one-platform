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
