module.exports = {
  plugins: ['wdio'],
  extends: 'plugin:wdio/recommended',
  env: {
    mocha: true
  },
  rules: {
    strict: 'off'
  }
}
