context( 'Test Error Page', () => {
    before( () => {
        cy.viewport( Cypress.env( 'width' ), Cypress.env( 'height' ) );
        cy.visit( Cypress.env( 'QA_HOST' ) + '123' );
        cy.get( '#username' ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click( { force: true } );
    } );
    it( 'Check the 404 image has loaded', () => {
        cy.get( "img[alt='404']" ).should( 'be.visible' );
    } )
    it( 'Check the heading has loaded', () => {
        cy.contains( 'Whoops! There is nothing here' ).should( 'be.visible' );
    } )
    it( 'Check the home page link is visible and redirecting to Home SPA', () => {
        cy.contains('Go to homepage').should('be.visible').should('have.attr','href','/')
    } )
    it( 'Check whether the links to other spas are visible', () => {
        cy.get( '#banner-links' ).should( 'be.visible' );
    } )
    it( 'Check whether user group spa link is present and having correct redirection', () => {
        cy.contains( 'User Group' ).should( 'have.attr', 'href','/user-groups' );
    } )
    it( 'Check whether Home Link is visible and having correct redirection', () => {
        cy.contains( 'Home' ).should( 'be.visible' ).should( 'have.attr', 'href', '/' );
    } )
    it( 'Check Documentation Link is visible and having correct redirection ', () => {
        cy.get('#banner-links').contains( 'Documentation' ).should( 'be.visible' ).should( 'have.attr', 'href','/get-started' );
    })
     it( 'Check Feedback link is visible and having correct redirection ', () => {
        cy.get('#banner-links').contains( 'Feedback' ).should( 'be.visible' ).should( 'have.attr', 'href', '/feedback' );
     } )
     it( 'Check Notifications is visible and having correct redirection ', () => {
        cy.get('#banner-links').contains( 'Notifications' ).should( 'be.visible' ).should( 'have.attr', 'href', '/notifications' );
    })
})
