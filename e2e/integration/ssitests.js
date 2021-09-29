import { apps } from '../helper/apps.list'
context('Test for SSI', () => {
  before(() => {
    cy.visit(Cypress.env('STAGE_HOST'))
    cy.get('#username', { timeout: 5000 }).type(Cypress.env('USERNAME'))
    cy.get('#password').type(Cypress.env('PASSWORD'))
    cy.get('#submit').click()
  })
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  })

  it('Test for Notifications section', () => {
    cy.get('.op-nav-wrapper').within(() => {
      cy.contains('Notifications').click()
    })
    cy.get('#op-menu-drawer').should('be.visible').within(() => {
      cy.get('.op-menu-drawer__title').should('contain.text', 'All Notifications ')
    })
  })

  // Tests for User Profile Section
  it('Test for User Profile Icon', () => {
    cy.get('.op-nav-wrapper').within(() => {
      cy.get('.op-menu__item').last().click()
    })
    cy.get('#op-menu-drawer').should('be.visible').within(() => {
      cy.get('.op-user-profile-icon').should('be.visible')
    })
  })

  it('Test for User Profile name', () => {
    cy.get('#op-menu-drawer').should('be.visible').within(() => {
      cy.get('.op-menu-drawer__title').should('contain.text', `${Cypress.env('USERNAME')} sso-tester`)
    })
  })

  it('Test for Signout section', () => {
    cy.get('#op-menu-drawer').should('be.visible').within(() => {
      cy.get('.op-user-signout-btn').should('contain.text', 'Sign Out')
    })
  })

  it('Test for View profile section', () => {
    cy.get('#op-menu-drawer').should('be.visible').within(() => {
      cy.get(`a[href="/user-groups/user/${Cypress.env('USERNAME')}"]`).should('contain.text', 'View Profile')
    })
  })

  it('Test for Get started Section', () => {
    cy.get('.op-nav-wrapper').within(() => {
      cy.get('a[ href = "/get-started" ]').should('be.visible')
    })
  })
})
