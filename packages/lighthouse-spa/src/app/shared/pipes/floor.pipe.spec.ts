import { FloorPipe } from './floor.pipe';

describe('FloorPipe', () => {
  const pipe = new FloorPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  } );

   it('should floor the input value', () => {
     expect(pipe.transform(9.99)).toEqual(9);
   });
});
