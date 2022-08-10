import { slugify } from './slugify';

describe('slugify', () => {
  test('should generate slug', () => {
    const data = slugify('hello world');

    expect(data).toEqual('hello-world');
  });
});
