const path = require('path');
const fs = require('fs');
const html = fs.readFileSync(path.resolve(__dirname, '../../dist/contact-us.html'), 'utf8');

jest.dontMock('fs');

describe('404 page', () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it('has a contact block', () => {
    expect(document.querySelector("body > div.container > div.contact-block > div.contact-block__right > img")).toBeTruthy();
    expect(document.querySelector("body > div.container > div.contact-block > div.contact-block__left")).toBeTruthy();
  });

  it('has team block', () => {
    expect(document.querySelector("body > div.container > div.team-block")).toBeTruthy();
  });
});