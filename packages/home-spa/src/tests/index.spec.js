const path = require('path');
const fs = require('fs');
const html = fs.readFileSync(path.resolve(__dirname, '../../dist/index.html'), 'utf8');
jest.dontMock('fs');

describe('home page', () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it('text exists', () => {
    expect(document.querySelector("body > div.hero > div > div.hero__header > p")).toBeTruthy();
    expect(document.querySelector("body > div.hero > div > div.hero__information > p")).toBeTruthy();
  });

  it('button exists', () => {
    expect(document.querySelector("body > div.hero > div > div.hero__links > button.button--primary")).toBeTruthy();
    expect(document.querySelector("body > div.hero > div > div.hero__links > button.button--light")).toBeTruthy();
  });

  it('microservice link exists', () => {
    expect(document.querySelector("#microservices")).toBeTruthy();
  });

  it('apps in spotlight link exists', () => {
    expect(document.querySelector("#apps-in-spotlight")).toBeTruthy();
  });

  it('carousel exists', () => {
    expect(document.querySelector("#carousel-slide")).toBeTruthy();
  });

  it('brand band exists', () => {
    expect(document.querySelector("body > div.band")).toBeTruthy();
  });

  it('footer exists', () => {
    expect(document.querySelector("body > footer")).toBeTruthy();
  });
});