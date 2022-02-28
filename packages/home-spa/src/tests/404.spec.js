/**
 * @jest-environment jsdom
 */
 const path = require('path');
 const fs = require('fs');
 const html = fs.readFileSync(path.resolve(__dirname, '../../dist/404/index.html'), 'utf8');
 
 jest.dontMock('fs');
 
 describe('404 page', () => {
   beforeAll(() => {
     document.documentElement.innerHTML = html.toString();
   });
 
   it('404 image exists', () => {
     expect(document.querySelector('body > div > div.banner__404 > img')).toBeTruthy();
   });
 
   it('text exists', () => {
     expect(document.querySelector('body > div > div.banner__text-block--normal')).toBeTruthy();
   });
 
   it('go back to home exists', () => {
     expect(document.querySelector('body > div > a')).toBeTruthy();
   });
 
   it('app links text exists', () => {
     expect(document.querySelector('body > div > p')).toBeTruthy();
   });
 });

