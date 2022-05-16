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
    it( 'Check whether the links count is greater than 1 and containing href attribute', () => {
        cy.get( '#banner-links a' ).should( 'have.length.gte', 1 ).should( 'have.attr', 'href' );
    })

})
