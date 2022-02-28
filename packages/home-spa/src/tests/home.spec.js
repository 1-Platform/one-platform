/**
 * @jest-environment jsdom
 */
const path = require('path');
const fs = require('fs');
const html = fs.readFileSync(path.resolve(__dirname, '../../dist/index.html'), 'utf8');
jest.dontMock('fs');

describe('home page', () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it('header exists', () => {
    expect(document.querySelector('body > div.hero > h1')).toBeTruthy();
  });

  it('button exists', () => {
    expect(document.querySelector('#applications > div.applications__view-more > button')).toBeTruthy();
  });

  it('microservice link exists', () => {
    expect(document.querySelector('body > section.services > div:nth-child(1)')).toBeTruthy();
  });

  it('deploy exists', () => {
    expect(document.querySelector('body > div.deploy')).toBeTruthy();
  });
});
