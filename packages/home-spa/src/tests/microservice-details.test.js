const path = require('path');
const fs = require('fs');
const html = fs.readFileSync(path.resolve(__dirname, '../../dist/microservice-details.html'), 'utf8');

jest.dontMock('fs');

describe('404 page', () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it('has header block', () => {
    expect(document.querySelector("body > h1")).toBeTruthy();
  });
  
  it('has microservice details block', () => {
      expect(document.querySelector("#microservice-details")).toBeTruthy();
  });
});