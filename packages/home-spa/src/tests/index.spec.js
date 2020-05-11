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

function getData(fetch, fetchOptions) {
  return fetch('https://localhost:8080', fetchOptions)
  .then(res => res.json())
  .then(data => data);
}

describe('getData from home-service', () => {
  it('fetch has localhost url', () => {
    const fetchMock = (url, options) => {
      assert(
        typeof url === typeof 'https://localhost:8080',
        typeof options === typeof fetchOptions,
      );
      return new Promise(resolve => {});
    };
    getData(fetchMock, fetchOptions);
  });

  it('fetch returns data', (done) => {
    const fetchMock = (url, options) => {
      return Promise.resolve({
        json: () => Promise.resolve({
          result: 
          {
            data: {
              listHomeType: {
                _id: '5eb15a6ac92f1d10e145755e'
              }
            }
          }
        })
      });
    };
    getData(fetchMock, fetchOptions)
    .then(
      dataResponse => {
        assert(dataResponse.result.data.listHomeType._id === '5eb15a6ac92f1d10e145755e')
        done()
      }
    )
  });
});