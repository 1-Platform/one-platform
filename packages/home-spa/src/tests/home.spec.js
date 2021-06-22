// @ts-nocheck
const path = require('path');
const fs = require('fs');
const html = fs.readFileSync(path.resolve(__dirname, '../../dist/index.html'), 'utf8');
jest.dontMock('fs');
const assert = require('assert');

describe('home page', () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it('text exists', () => {
    expect(document.querySelector("body > header > div.header__content > h3")).toBeTruthy();
  });

  it('Get Started button exists', () => {
    expect(document.querySelector("body > header > div.header__content > div > a:nth-child(1)")).toBeTruthy();
  });

  it('Learn more button exists', () => {
    expect(document.querySelector("body > header > div.header__content > div > a:nth-child(2)")).toBeTruthy();
  });

  it('Quick Deploy button exists', () => {
    expect(document.querySelector("#quick-deploy")).toBeTruthy();
  });

  it('Deploy Steps exists', () => {
    expect(document.querySelector("#deployments")).toBeTruthy();
  });

  it('Built in microservices exists', () => {
    expect(document.querySelector("#microservices")).toBeTruthy();
  });

  it('footer exists', () => {
    expect(document.querySelector("body > footer")).toBeTruthy();
  });
});

const fetchOptions = {
  method: "post",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    query: `query {
      listHomeType {
          _id
          }
      }`,
  })
};
