/**
 * MIT License
 * Copyright (c) 2021 Red Hat One Platform
 *
 * Puppeteer Script to bypass the login page with lighthouse.
 *
 * @author Rigin Oommen <riginoommen@gmail.com>
 *
 * @requires SSO_USERNAME Managed in the jenkins credentials store.
 * @requires SSO_PASSWORD Managed in the jenkins credentials store.
 *
 * Created at     : 2021-07-09 16:18:34
 * Last modified  : 2021-07-09 16:23:59
 */


module.exports = async ( browser ) => {
  console.info('Puppeteer script execution started');
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto('https://one.redhat.com', {
    waitUntil: 'networkidle2',
  } );
  await page.type('#username', process.env.SSO_USERNAME);
  await page.type( '#password', process.env.SSO_PASSWORD);
  await page.click('[type="submit"]');
  await navigationPromise;
  console.info('Puppeteer script execution completed');
};
