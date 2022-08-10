import { urlProtocolRemover } from './urlProtocolRemover';

describe('URLProtocolRemover', () => {
  test('should remove protocol', () => {
    const data = urlProtocolRemover('https://test.com');
    expect(data).toEqual('test.com');
  });
});
