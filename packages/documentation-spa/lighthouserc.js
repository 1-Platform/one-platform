/**
 * MIT License
 * Copyright (c) 2021 Red Hat One Platform
 *
 * Lighthouse CI Configuration
 * https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md
 *
 * @author Rigin Oommen <riginoommen@gmail.com>
 *
 * Created at     : 2021-07-09 16:18:34
 * Last modified  : 2021-07-19 11:59:53
 */
const urls = ['/get-started'].map(link => process.env.LH_HOST + link)
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      puppeteerScript: '../../puppeteerScript.js',
      puppeteerLaunchOptions: {
        args: [
          '--no-sandbox',
          '--ignore-certificate-errors'
        ]
      },
      url: urls
    },
    assert: {
      preset: 'lighthouse:recommended'
    }
  }
}
