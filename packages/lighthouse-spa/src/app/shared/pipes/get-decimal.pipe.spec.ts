import { GetDecimalPipe } from './get-decimal.pipe';

describe('GetDecimalPipe', () => {
  const pipe = new GetDecimalPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should get the decimal part', () => {
    expect(pipe.transform(9.99)).toEqual('99');
  });
});
