const App = require('../pageobjects/app.page')

describe('Vue.js app', () => {
  it('should open and render', () => {
    App.open()
    expect(App.heading).toHaveText('Welcome to Your Vue.js App')
  })
})
