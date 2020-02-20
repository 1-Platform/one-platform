const puppeteerChrome = require('puppeteer');
const path = require('path');
const fs = require('fs');
const html = fs.readFileSync(path.resolve(__dirname, '../../dist/index.html'), 'utf8');

jest.dontMock('fs');

test('home e2e', async () => {
  const browser = await puppeteerChrome.launch({
    headless: false,
    slowMo: 10,
    timeout: 10000,
    args: ['--window-size=1580,800'],
  });
  const page = await browser.newPage();
  const app = 'file:///' + path.resolve(__dirname, '../../dist/index.html');
  await page.goto(app);
  await page.click('body > div.hero > div > div.hero__links > button.button--primary');
  await browser.close();
});

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

  it('tabs exists', () => {
    expect(document.querySelector("#main > pfe-tabs")).toBeTruthy();
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