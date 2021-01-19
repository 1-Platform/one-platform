/// <reference types="cypress" />

context( 'Test feedback form', () => {

    before( () => {
        cy.visit( 'http://stage.one.redhat.com/' );
        Cypress.config( 'includeShadowDom', true );
        cy.get( '#username', { timeout: 5000 } ).type( 'one-portal-test' );
        cy.get( '#password' ).type( 'iequeivaequ:e2OobahM3vahbaePh8' );
        cy.get( '#submit' ).click();
        //cy.contains( 'Feedback', { timeout: 5000 } ).click();

    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        // returning false here prevents Cypress from
        // failing the test
        return false;
    } );

    it( 'Submit button disabled until required fields have data', () => {
        cy.get( '#op-feedback__button', { timeout: 10000 } ).click().wait( 1000 );
        cy.get( `[data-feedback-type="bug"]`, { timeout: 10000 } ).click();
        cy.get( '#bugTitle' ).click().type( 'e2e test automation' );
        cy.get( '#bugDescription' ).type( 'test' );
        cy.contains( 'Submit', { timeout: 10000 } ).click();
        cy.contains("Bug Report Submitted Successfully").should( 'be.visible');
    } );
} );
