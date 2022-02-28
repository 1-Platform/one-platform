/**
 * @jest-environment jsdom
 */
const path = require('path');
const fs = require('fs');
const html = fs.readFileSync(path.resolve(__dirname, '../../dist/contact-us/index.html'), 'utf8');

jest.dontMock('fs');

describe('Contact Us page', () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it('has a email addresses', () => {
    expect(document.querySelector('body > div > div.contact-block > div.contact-block__left > div.contact-block__mail-list > div:nth-child(1) > span')).toBeTruthy();
    expect(document.querySelector('body > div > div.contact-block > div.contact-block__left > div.contact-block__mail-list > div:nth-child(1) > a')).toBeTruthy();
  });

  it('has team block', () => {
    expect(document.querySelector('body > div > div.team-block')).toBeTruthy();
  });
});
