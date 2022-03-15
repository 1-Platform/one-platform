/// <reference types="Cypress" />
///
context( 'Home Page Tests', () => {
    before( () => {
        cy.viewport( Cypress.env( 'width' ), Cypress.env( 'height' ) );
        cy.visit( Cypress.env( 'QA_HOST' ), { timeout: 10000 } );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit', { timeout: 10000 } ).click( { force: true } );
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );
    it( 'Check whether the heading is visible', () => {
        cy.contains('We connect users to an experience').should('be.visible')
    } )
    it( 'Test for visibility of apps', () => {
        cy.get('.apps',{force:true}).should('be.visible')
    } )
    it( 'Test for visibility of Deploy delivr section', () => {
        cy.get( '.deliver.container',{force:true} ).should( 'be.visible' );
    } )
    it( 'Check whether authentication heading is visible', () => {
        cy.contains( 'Authentication',{force:true} ).should( 'be.visible' );
    } )
    it( 'Check whether Feedback heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title'][normalize-space()='Feedback']").should('be.visible')
    } )
    it( 'Check whether Notification heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title' and contains(text(),'Notification')]",{force:true}).should('be.visible')
    } )
    it( 'Check whether User grop heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title' and contains(text(),'User Group')]",{force:true}).should('be.visible')
    } )
    it( 'Check whether Search heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title' and contains(text(),'Search')]",{force:true}).should('be.visible')
    } )
    it( 'Check the Header at the bottom is visible', () => {
        cy.get('.deploy__info-title').should('contain.text','Deploy your app on One Platform')
    })
})
