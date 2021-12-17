import { FilterListPipe } from './filter-list.pipe';

fdescribe('FilterListPipe', () => {
  const pipe = new FilterListPipe();
  const objectInput = [{ name: 'hello' }, { name: 'world' }];
  const stringInput = ['hello', 'world'];
  const numberInput = [1, 2];

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should filter an array of objects', () => {
    expect(pipe.transform(objectInput, 'hello', 'name').length).toEqual(1);
  });

  it('should filter an array of string', () => {
    expect(pipe.transform(stringInput, 'hello').length).toEqual(1);
  });

  it('should filter an array of numbers', () => {
    expect(pipe.transform(numberInput, 1).length).toEqual(1);
  });
});
