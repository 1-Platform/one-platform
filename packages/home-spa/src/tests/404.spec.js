// @ts-nocheck
const path = require('path');
const fs = require('fs');
const html = fs.readFileSync(path.resolve(__dirname, '../../dist/404.html'), 'utf8');

jest.dontMock('fs');

describe('404 page', () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it('text exists', () => {
    expect(document.querySelector("body > div.banner > div.banner__text-block--medium > h1")).toBeTruthy();
    expect(document.querySelector("body > div.banner > div.banner__text-block--normal")).toBeTruthy();
  });

  it('anchor exists', () => {
    expect(document.querySelector("body > div.banner > a")).toBeTruthy();
  });

  it('links exists', () => {
    expect(document.querySelector("#banner-links")).toBeTruthy();
  });

  it('brand band exists', () => {
    expect(document.querySelector("body > div.band")).toBeTruthy();
  });

  it('footer exists', () => {
    expect(document.querySelector("body > footer")).toBeTruthy();
  });
});
